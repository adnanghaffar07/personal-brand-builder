
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Loader2 } from "lucide-react";

interface LinkedInProfile {
  id: string;
  name: string;
  designation: string;
  location: string;
  companyName: string;
  companySize: string;
}

interface LinkedInDataTableProps {
  showDataTable: boolean;
  isFetchingData: boolean;
  linkedInData: LinkedInProfile[];
}

const LinkedInDataTable = ({ showDataTable, isFetchingData, linkedInData }: LinkedInDataTableProps) => {
  if (!showDataTable) return null;

  return (
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
                {linkedInData.map((profile) => (
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
  );
};

export default LinkedInDataTable;
