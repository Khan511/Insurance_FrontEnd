import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export type Claims = {
  id: number;
  number: string;
  type: string;
  status: string;
  amount: string;
  date: string;
};

interface Props {
  claims: Claims[];
}

export default function MyClaims({ claims }: Props) {
  return (
    <TabsContent value="claims">
      <Card className="mt-6">
        <CardHeader className="pt-4 text-center text-2xl text-blue-500">
          <CardTitle>Insurance Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h3 className="font-semibold">{claim.type}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Claim #: {claim.number}
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-0">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        claim.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : claim.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {claim.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Filed: {claim.date}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-between items-center">
                  <p className="font-medium">Amount: {claim.amount}</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Upload Documents
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
