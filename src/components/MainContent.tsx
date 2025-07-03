import { useState, useEffect } from "react";
import ChatInterface from "./ChatInterface";
import SearchCriteriaComponent from "./SearchCriteria";
import LinkedInDataTable from "./LinkedInDataTable";
import { useToast } from "@/hooks/use-toast";

interface MainContentProps {
  sidebarOpen: boolean;
}

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

interface SearchCriteria {
  location?: string;
  jobTitles?: string[];
  companySize?: string;
  industry?: string;
  estimatedMatches?: number;
}

interface LinkedInProfile {
  id: string;
  name: string;
  designation: string;
  location: string;
  companyName: string;
  companySize: string;
}

const MainContent = ({ sidebarOpen }: MainContentProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({});
  const [dailyTarget, setDailyTarget] = useState(15);
  const [linkedInData, setLinkedInData] = useState<LinkedInProfile[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);
  const { toast } = useToast();

  // Load search criteria from localStorage on component mount
  useEffect(() => {
    const savedCriteria = localStorage.getItem('searchCriteria');
    if (savedCriteria) {
      try {
        const parsedCriteria = JSON.parse(savedCriteria);
        setSearchCriteria(parsedCriteria);
      } catch (error) {
        console.error('Error parsing saved criteria:', error);
      }
    }
  }, []);

  const dummyLinkedInData: LinkedInProfile[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      designation: "Marketing Director",
      location: "San Francisco, CA",
      companyName: "TechCorp Inc.",
      companySize: "500-1000"
    },
    {
      id: "2",
      name: "Michael Chen",
      designation: "VP of Sales",
      location: "New York, NY",
      companyName: "InnovateTech",
      companySize: "200-500"
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      designation: "CEO",
      location: "Austin, TX",
      companyName: "StartupX",
      companySize: "50-200"
    },
    {
      id: "4",
      name: "David Kim",
      designation: "CTO",
      location: "Seattle, WA",
      companyName: "CloudSoft",
      companySize: "1000+"
    },
    {
      id: "5",
      name: "Lisa Wang",
      designation: "Head of Marketing",
      location: "Los Angeles, CA",
      companyName: "MediaFlow",
      companySize: "100-500"
    }
  ];

  const handleSaveSearchCriteria = async () => {
    // Get the properly formatted criteria from localStorage
    const savedDbCriteria = localStorage.getItem('searchCriteriaDB');
    let alertData = {
      state: "",
      role: "",
      company_size: "",
      industry: ""
    };
    
    if (savedDbCriteria) {
      try {
        alertData = JSON.parse(savedDbCriteria);
      } catch (error) {
        console.error('Error parsing saved DB criteria:', error);
      }
    }

    // Check if we have any criteria to save
    if (!alertData.state && !alertData.role && !alertData.company_size && !alertData.industry) {
      toast({
        title: "No criteria to save",
        description: "Please start a conversation to generate search criteria first.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Sending alert data:', alertData);

      const response = await fetch('http://localhost:5001/api/save-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Alert saved successfully:', result);
        
        toast({
          title: "Search criteria saved!",
          description: "Your LinkedIn search criteria have been successfully saved to the database.",
        });
        
        // Also save to localStorage as backup
        const criteriaData = {
          criteria: alertData,
          savedAt: new Date().toISOString(),
          id: `search-${Date.now()}`
        };

        const savedCriteriaHistory = localStorage.getItem('savedSearchCriteria');
        const existingCriteria = savedCriteriaHistory ? JSON.parse(savedCriteriaHistory) : [];
        existingCriteria.push(criteriaData);
        localStorage.setItem('savedSearchCriteria', JSON.stringify(existingCriteria));
      } else {
        console.error('Failed to save alert:', response.statusText);
        toast({
          title: "Save failed",
          description: "Failed to save search criteria. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving alert:', error);
      toast({
        title: "Error",
        description: "Error saving search criteria. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const handleFetchLinkedInData = async () => {
    setIsFetchingData(true);
    setShowDataTable(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setLinkedInData(dummyLinkedInData);
      setIsFetchingData(false);
    }, 3000);
  };

  const handleExportInstructions = () => {
    // Get the latest criteria from localStorage
    const savedCriteria = localStorage.getItem('searchCriteria');
    let currentCriteria = searchCriteria;
    
    if (savedCriteria) {
      try {
        currentCriteria = JSON.parse(savedCriteria);
      } catch (error) {
        console.error('Error parsing saved criteria:', error);
      }
    }

    if (Object.keys(currentCriteria).length === 0) {
      toast({
        title: "No criteria to export",
        description: "Please start a conversation to generate search criteria first.",
        variant: "destructive",
      });
      return;
    }

    const instructions = `LinkedIn Search Instructions
Generated on: ${new Date().toLocaleDateString()}

Search Criteria:
${currentCriteria.location ? `• Location: ${currentCriteria.location}` : ''}
${currentCriteria.jobTitles ? `• Job Titles: ${currentCriteria.jobTitles.join(', ')}` : ''}
${currentCriteria.companySize ? `• Company Size: ${currentCriteria.companySize}` : ''}
${currentCriteria.industry ? `• Industry: ${currentCriteria.industry}` : ''}
${currentCriteria.estimatedMatches ? `• Estimated Matches: ${currentCriteria.estimatedMatches}` : ''}

Instructions:
1. Go to LinkedIn Sales Navigator or LinkedIn Advanced Search
2. Apply the filters above in the corresponding fields
3. Review the results and refine as needed
4. Start your outreach campaign with personalized messages

Tips:
- Be specific about job titles for better targeting
- Consider company size based on your ideal customer profile
- Adjust location radius if needed for broader reach
`;

    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-search-instructions-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Instructions exported!",
      description: "LinkedIn search instructions have been downloaded successfully.",
    });

    console.log("Instructions exported:", instructions);
  };

  return (
    <div className={`flex-1 transition-all duration-300 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}`}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Section: Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface
              messages={messages}
              setMessages={setMessages}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              searchCriteria={searchCriteria}
              setSearchCriteria={setSearchCriteria}
            />
          </div>

          {/* Right Section: LinkedIn Search Criteria */}
          <div className="space-y-6">
            <SearchCriteriaComponent
              searchCriteria={searchCriteria}
              dailyTarget={dailyTarget}
              setDailyTarget={setDailyTarget}
              isFetchingData={isFetchingData}
              onFetchLinkedInData={handleFetchLinkedInData}
              onSaveSearchCriteria={handleSaveSearchCriteria}
              onExportInstructions={handleExportInstructions}
            />
          </div>
        </div>

        {/* Full-width Fetched LinkedIn Data Section */}
        <LinkedInDataTable
          showDataTable={showDataTable}
          isFetchingData={isFetchingData}
          linkedInData={linkedInData}
        />
      </div>
    </div>
  );
};

export default MainContent;
