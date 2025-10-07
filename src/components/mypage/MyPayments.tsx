import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { useGetAllPoliciesOfUserQuery } from "@/services/InsurancePolicySlice";
import { Spinner } from "react-bootstrap";

export default function Mypayments() {
  const { data: currentUser } = useGetCurrenttUserQuery();
  const userId = currentUser?.data?.user?.userId;
  const { data: myAllPolicies, isLoading } = useGetAllPoliciesOfUserQuery(
    userId || "",
    {
      skip: !userId,
    }
  );

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading)
    return (
      <div className=" flex justify-center items-center ext-center mt-5 mx-auto">
        <Spinner />
      </div>
    );

  if (myAllPolicies?.length === 0) {
    return (
      <div className="flex justify-center items-center mt-4 text-2xl mb-5 text-blue-500 font-semibold">
        <p>No Upcoming Payments!</p>
      </div>
    );
  }

  return (
    <TabsContent value="payments">
      <Card className="mt-6">
        <CardHeader className="pt-4 text-center text-2xl  text-blue-500">
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold  m-2 mb-3">Upcoming Payments</h3>
            <div className="space-y-4">
              {myAllPolicies?.map((policy) => (
                <div
                  key={policy.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">Policy #{policy.productCode}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due Date:{" "}
                      {formatDate(policy.paymentSchedules?.[0]?.dueDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Amount: {policy.paymentSchedules?.[0]?.dueAmount || 0}{" "}
                      {policy.currency}
                    </p>
                    <p>{policy.paymentFrequency}</p>

                    <button className="btn btn-primary text-white rounded-2xl">
                      Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-4">Payment History</h3>
            <div className="text-center py-8">
              <p className="text-gray-500">No recent payments found</p>
              <Button variant="link" className="mt-2">
                View full history
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
