import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export type Document = {
  id: number;
  name: string;
  type: string;
  date: string;
};

interface Props {
  documents: Document[];
}
export default function MyDocuments({ documents }: Props) {
  return (
    <TabsContent value="documents">
      <Card className="mt-6">
        <CardHeader className="pt-4 text-center text-2xl text-blue-500">
          <CardTitle>Policy Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-lg mr-4">
                    <FileText className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-600">
                      {doc.type} • {doc.date}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
