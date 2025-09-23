import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import {
  useGetAllPoliciesOfUserQuery,
  // useGetPolicyPaymentsQuery,
} from "@/services/InsurancePolicySlice";

export type Payment = {
  id: number;
  policy: string;
  amount: string;
  dueDate: string;
};

interface Props {
  upcomingPayments: Payment[];
}

export default function Mypayments({ upcomingPayments }: Props) {
  const { data: currentUser } = useGetCurrenttUserQuery();
  const userId = currentUser?.data?.user?.userId;
  const { data: myAllPolicies, isLoading } = useGetAllPoliciesOfUserQuery(
    userId || "",
    {
      skip: !userId,
    }
  );

  // const { data: policyPayments } = useGetPolicyPaymentsQuery();

  // console.log("PolicyPayments", policyPayments);

  return (
    <TabsContent value="payments">
      <Card className="mt-6">
        <CardHeader className="pt-4 text-center text-2xl text-blue-500">
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
                    <p className="text-sm text-gray-600 flex iteyou ms-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {/* Due: {policy.dueDate} */}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{}</p>
                    <Button size="sm" className="text-white">
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
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
