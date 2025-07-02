
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Target, Users, FileText, Download, Save, Sparkles, MapPin, Building, Briefcase, Hash, Minus, Plus, Loader2 } from "lucide-react";

interface SearchCriteria {
  location?: string;
  jobTitles?: string[];
  companySize?: string;
  industry?: string;
  estimatedMatches?: number;
}

interface SearchCriteriaProps {
  searchCriteria: SearchCriteria;
  dailyTarget: number;
  setDailyTarget: React.Dispatch<React.SetStateAction<number>>;
  isFetchingData: boolean;
  onFetchLinkedInData: () => void;
  onSaveSearchCriteria: () => void;
  onExportInstructions: () => void;
}

const SearchCriteriaComponent = ({
  searchCriteria,
  dailyTarget,
  setDailyTarget,
  isFetchingData,
  onFetchLinkedInData,
  onSaveSearchCriteria,
  onExportInstructions
}: SearchCriteriaProps) => {
  const increaseDailyTarget = () => {
    setDailyTarget(prev => Math.min(30, prev + 1));
  };

  const decreaseDailyTarget = () => {
    setDailyTarget(prev => Math.max(1, prev - 1));
  };

  const handleSliderChange = (value: number[]) => {
    setDailyTarget(value[0]);
  };

  return (
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
            onClick={onFetchLinkedInData}
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
            onClick={onSaveSearchCriteria}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Search Criteria
          </Button>
          <Button
            variant="outline"
            className="w-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transform transition-all duration-200 hover:scale-105"
            disabled={Object.keys(searchCriteria).length === 0}
            onClick={onExportInstructions}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Instructions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchCriteriaComponent;
