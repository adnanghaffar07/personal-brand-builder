
import { useState } from "react";
import ChatInterface from "./ChatInterface";
import SearchCriteriaComponent from "./SearchCriteria";
import LinkedInDataTable from "./LinkedInDataTable";

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

  const handleFetchLinkedInData = async () => {
    setIsFetchingData(true);
    setShowDataTable(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setLinkedInData(dummyLinkedInData);
      setIsFetchingData(false);
    }, 3000);
  };

  const handleSaveSearchCriteria = () => {
    if (Object.keys(searchCriteria).length === 0) {
      alert("No search criteria to save. Please start a conversation to generate criteria.");
      return;
    }

    const criteriaData = {
      criteria: searchCriteria,
      savedAt: new Date().toISOString(),
      id: `search-${Date.now()}`
    };

    const savedCriteria = localStorage.getItem('savedSearchCriteria');
    const existingCriteria = savedCriteria ? JSON.parse(savedCriteria) : [];
    existingCriteria.push(criteriaData);
    localStorage.setItem('savedSearchCriteria', JSON.stringify(existingCriteria));

    alert("Search criteria saved successfully!");
    console.log("Saved criteria:", criteriaData);
  };

  const handleExportInstructions = () => {
    if (Object.keys(searchCriteria).length === 0) {
      alert("No search criteria to export. Please start a conversation to generate criteria.");
      return;
    }

    const instructions = `LinkedIn Search Instructions
Generated on: ${new Date().toLocaleDateString()}

Search Criteria:
${searchCriteria.location ? `• Location: ${searchCriteria.location}` : ''}
${searchCriteria.jobTitles ? `• Job Titles: ${searchCriteria.jobTitles.join(', ')}` : ''}
${searchCriteria.companySize ? `• Company Size: ${searchCriteria.companySize}` : ''}
${searchCriteria.industry ? `• Industry: ${searchCriteria.industry}` : ''}
${searchCriteria.estimatedMatches ? `• Estimated Matches: ${searchCriteria.estimatedMatches}` : ''}

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
