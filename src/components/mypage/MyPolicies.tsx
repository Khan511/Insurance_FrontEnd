import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";

export type Policy = {
  id: number;
  number: string;
  type: string;
  status: string;
  premium: string;
  renewal: string;
};

interface Props {
  policies: Policy[];
}

export default function MyPolicies({ policies }: Props) {
  return (
    <TabsContent value="policies">
      <Card className="mt-6">
        <CardHeader className="pt-4 text-center text-2xl text-blue-500">
          <CardTitle>Insurance Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold">{policy.type}</h3>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          policy.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {policy.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Policy #: {policy.number}
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-0 text-right">
                    <p className="font-medium">{policy.premium}/mo</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Renewal: {policy.renewal}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Make Payment
                  </Button>
                  <Button variant="outline" size="sm">
                    File Claim
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
