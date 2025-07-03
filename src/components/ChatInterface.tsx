import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Target, Zap } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useToast } from "@/hooks/use-toast";

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

interface ChatInterfaceProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
  searchCriteria: SearchCriteria;
}

const ChatInterface = ({ 
  messages, 
  setMessages, 
  isLoading, 
  setIsLoading, 
  setSearchCriteria, 
  searchCriteria 
}: ChatInterfaceProps) => {
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const parseSearchCriteria = (parsedData: string) => {
    console.log('Raw parsed data:', parsedData);
    
    // Parse the criteria from the string
    const criteria: SearchCriteria = {};

    // Extract state/location - keep as is
    const stateMatch = parsedData.match(/state\s*=\s*([^\n]+)/i);
    if (stateMatch) {
      criteria.location = stateMatch[1].trim();
    }

    // Extract role/job titles - format as "CEO OR Founder"
    const roleMatch = parsedData.match(/role\s*=\s*([^\n]+)/i);
    if (roleMatch) {
      let roleText = roleMatch[1].trim();
      // Remove parentheses if present
      roleText = roleText.replace(/^\(|\)$/g, '');
      // Keep OR format as is
      criteria.jobTitles = [roleText];
    }

    // Extract company size - keep the operator format ">= 50"
    const companySizeMatch = parsedData.match(/company_size\s*([><=]+)\s*([^\n]+)/i);
    if (companySizeMatch) {
      criteria.companySize = `${companySizeMatch[1]} ${companySizeMatch[2].trim()}`;
    }

    // Extract industry - keep as is
    const industryMatch = parsedData.match(/industry\s*=\s*([^\n]+)/i);
    if (industryMatch) {
      criteria.industry = industryMatch[1].trim();
    }

    // Add estimated matches (mock data for now)
    criteria.estimatedMatches = Math.floor(Math.random() * 500) + 100;

    console.log('Parsed criteria:', criteria);
    
    // Save to localStorage with the proper format for database
    const dbFormat = {
      state: criteria.location || "",
      role: criteria.jobTitles ? criteria.jobTitles[0] : "",
      company_size: criteria.companySize || "",
      industry: criteria.industry || ""
    };
    
    localStorage.setItem('searchCriteria', JSON.stringify(criteria));
    localStorage.setItem('searchCriteriaDB', JSON.stringify(dbFormat));
    
    return criteria;
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
      console.log('API response:', data);

      // Parse the criteria properly
      const parsedCriteria = parseSearchCriteria(data.parsed);
      
      // Update search criteria with merged data
      setSearchCriteria(prev => ({ ...prev, ...parsedCriteria }));

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: `Perfect! Based on your query: "${userMessage.message}", I've identified these LinkedIn search filters:

${parsedCriteria.location ? `📍 Location: ${parsedCriteria.location}` : ''}
${parsedCriteria.jobTitles && parsedCriteria.jobTitles.length > 0 ? `💼 Job Titles: ${parsedCriteria.jobTitles.join(', ')}` : ''}
${parsedCriteria.companySize ? `🏢 Company Size: ${parsedCriteria.companySize}` : ''}
${parsedCriteria.industry ? `🏭 Industry: ${parsedCriteria.industry}` : ''}
${parsedCriteria.estimatedMatches ? `📊 Estimated Matches: ${parsedCriteria.estimatedMatches}` : ''}

You can now save these criteria or fetch LinkedIn data from the panel on the right!`,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      
      toast({
        title: "Search criteria updated!",
        description: "Your LinkedIn search filters have been successfully parsed and are ready to use.",
      });
    } catch (error) {
      console.error('Error parsing filters:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to parse your request. Please try again.",
        variant: "destructive",
      });
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
  );
};

export default ChatInterface;
