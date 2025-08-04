import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

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
  return (
    <TabsContent value="payments">
      <Card className="mt-6">
        <CardHeader className="pt-4 text-center text-2xl text-blue-500">
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Upcoming Payments</h3>
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">Policy #{payment.policy}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {payment.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{payment.amount}</p>
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
