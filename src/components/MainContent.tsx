import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Send, Sparkles, Target, Users, FileText, Download, Save, Zap, MapPin, Building, Briefcase, Hash, Minus, Plus, Loader2 } from "lucide-react";
import ChatMessage from "./ChatMessage";

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
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({});
  const [dailyTarget, setDailyTarget] = useState(15);
  const [linkedInData, setLinkedInData] = useState<LinkedInProfile[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [showDataTable, setShowDataTable] = useState(true);

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

  const increaseDailyTarget = () => {
    setDailyTarget(prev => Math.min(30, prev + 1));
  };

  const decreaseDailyTarget = () => {
    setDailyTarget(prev => Math.max(1, prev - 1));
  };

  const handleSliderChange = (value: number[]) => {
    setDailyTarget(value[0]);
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

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: query,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/parse-filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: `Perfect! Based on your query: "${userMessage.message}", here are some LinkedIn search filters:\n\n${data.parsed || 'No filters found. Please rephrase your request.'}`,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setSearchCriteria({ ...searchCriteria, ...data.parsed });
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex-1 transition-all duration-300 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}`}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Section: Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">AI Query Builder</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex text-nowrap items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                      <Zap className="w-3 h-3 mr-1" />
                      AI Powered
                    </span>
                  </div>
                </div>

                <div className="flex-1 mb-4 border rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-inner overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-6 h-[500px] max-h-[500px] overflow-y-auto">
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                            <Target className="w-10 h-10 text-blue-600" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">Let's build your target audience</h4>
                          <p className="text-gray-600 mb-4 max-w-md">Describe your ideal LinkedIn prospects in natural language, and I'll help you create precise targeting criteria.</p>
                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-700 font-medium mb-1">💡 Try this example:</p>
                            <p className="text-sm text-gray-600 italic">"Target CEOs and founders in Missouri at companies with 50+ employees in the technology sector"</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((msg) => (
                            <ChatMessage
                              key={msg.id}
                              message={msg.message}
                              isUser={msg.isUser}
                              timestamp={msg.timestamp}
                            />
                          ))}
                          {isLoading && (
                            <div className="flex justify-start mb-4">
                              <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100">
                                <div className="flex items-center space-x-2">
                                  <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div className="relative">
                  <Textarea
                    className="pr-14 resize-none border-2 border-gray-200 focus:border-blue-400 rounded-xl bg-white/90 backdrop-blur-sm"
                    placeholder="Describe your target audience... (e.g., 'Find marketing directors in California at SaaS companies')"
                    rows={3}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  <Button
                    className="absolute bottom-3 right-3 h-10 w-10 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transform transition-all duration-200 hover:scale-105"
                    disabled={!query.trim() || isLoading}
                    onClick={handleSendMessage}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section: LinkedIn Search Criteria */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Search Criteria</h3>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-500" />
                      Active Filters
                    </h4>
                    {Object.keys(searchCriteria).length === 0 ? (
                      <div className="text-sm text-gray-500 italic">
                        No filters applied yet. Start chatting to generate criteria!
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {searchCriteria.location && (
                          <div className="flex items-center text-sm bg-white p-2 rounded-lg shadow-sm">
                            <MapPin className="w-4 h-4 mr-2 text-green-500" />
                            <span className="font-medium">Location:</span>
                            <span className="ml-1 text-gray-700">{searchCriteria.location}</span>
                          </div>
                        )}
                        {searchCriteria.jobTitles && searchCriteria.jobTitles.length > 0 && (
                          <div className="flex items-center text-sm bg-white p-2 rounded-lg shadow-sm">
                            <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="font-medium">Job Titles:</span>
                            <span className="ml-1 text-gray-700">{searchCriteria.jobTitles.join(', ')}</span>
                          </div>
                        )}
                        {searchCriteria.companySize && (
                          <div className="flex items-center text-sm bg-white p-2 rounded-lg shadow-sm">
                            <Building className="w-4 h-4 mr-2 text-purple-500" />
                            <span className="font-medium">Company Size:</span>
                            <span className="ml-1 text-gray-700">{searchCriteria.companySize}</span>
                          </div>
                        )}
                        {searchCriteria.industry && (
                          <div className="flex items-center text-sm bg-white p-2 rounded-lg shadow-sm">
                            <Hash className="w-4 h-4 mr-2 text-orange-500" />
                            <span className="font-medium">Industry:</span>
                            <span className="ml-1 text-gray-700">{searchCriteria.industry}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="text-3xl font-bold text-gray-600 mb-1">
                        {searchCriteria.estimatedMatches || 0}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center justify-center">
                        <Users className="w-4 h-4 mr-1" />
                        Est. Matches
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{dailyTarget}</div>
                      <div className="text-sm text-blue-600 flex items-center justify-center mb-2">
                        <Target className="w-4 h-4 mr-1" />
                        Daily Target
                      </div>
                    </div>
                  </div>

                  {/* Daily Target Slider */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Daily Target</span>
                      <span className="text-sm text-gray-500">{dailyTarget}/30</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={decreaseDailyTarget}
                        disabled={dailyTarget <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <div className="flex-1">
                        <Slider
                          value={[dailyTarget]}
                          onValueChange={handleSliderChange}
                          max={30}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={increaseDailyTarget}
                        disabled={dailyTarget >= 30}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <Sparkles className="w-4 h-4 text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-yellow-800">Pro Tip</span>
                    </div>
                    <p className="text-xs text-yellow-700">Be specific about job titles, company size, and location for better targeting results.</p>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg transform transition-all duration-200 hover:scale-105"
                    disabled={Object.keys(searchCriteria).length === 0 || isFetchingData}
                    onClick={handleFetchLinkedInData}
                  >
                    {isFetchingData ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Fetching Data...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Fetch LinkedIn Data
                      </>
                    )}
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transform transition-all duration-200 hover:scale-105"
                    disabled={Object.keys(searchCriteria).length === 0}
                    onClick={handleSaveSearchCriteria}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Search Criteria
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transform transition-all duration-200 hover:scale-105"
                    disabled={Object.keys(searchCriteria).length === 0}
                    onClick={handleExportInstructions}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Instructions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full-width Fetched LinkedIn Data Section */}
        {showDataTable && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Fetched LinkedIn Data</h3>
              </div>

              {isFetchingData ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                  <p className="text-gray-600">Fetching LinkedIn profiles...</p>
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50">
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Designation</TableHead>
                        <TableHead className="font-semibold">Company Name</TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Company Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummyLinkedInData.map((profile) => (
                        <TableRow key={profile.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{profile.name}</TableCell>
                          <TableCell>{profile.designation}</TableCell>
                          <TableCell>{profile.companyName}</TableCell>
                          <TableCell>{profile.location}</TableCell>
                          <TableCell>{profile.companySize}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MainContent;
