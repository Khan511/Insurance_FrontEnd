import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Calendar, CheckCircle } from "lucide-react";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import {
  useGetAllPoliciesOfUserQuery,
  useProcessPaymentMutation,
} from "@/services/InsurancePolicySlice";
import { Spinner } from "react-bootstrap";
import { useState } from "react";

export default function Mypayments() {
  const { data: currentUser } = useGetCurrenttUserQuery();
  const userId = currentUser?.data?.user?.userId;
  const {
    data: myAllPolicies,
    refetch,
    isLoading,
  } = useGetAllPoliciesOfUserQuery(userId || "", {
    skip: !userId,
  });
  const [processPayment, { isLoading: isProcessing }] =
    useProcessPaymentMutation();

  // Track individual loading states
  const [processingPayments, setProcessingPayments] = useState<Set<number>>(
    new Set()
  );

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateWithTime = (dateInput?: string | number[] | null): string => {
    if (!dateInput) return "Date not available";

    let date: Date;

    // Handle array format: [year, month, day, hour, minute, second, nanosecond]
    if (Array.isArray(dateInput)) {
      // Convert array to Date object
      // Note: JavaScript months are 0-indexed (0 = January, 11 = December)
      // So subtract 1 from the month
      date = new Date(
        dateInput[0], // year
        dateInput[1] - 1, // month (subtract 1)
        dateInput[2], // day
        dateInput[3] || 0, // hours
        dateInput[4] || 0, // minutes
        dateInput[5] || 0, // seconds
        dateInput[6] ? Math.floor(dateInput[6] / 1000000) : 0 // convert nanoseconds to milliseconds
      );
    } else {
      // Handle string format
      date = new Date(dateInput);
    }

    // Check if it's a valid date
    if (isNaN(date.getTime())) {
      console.log("Invalid date created from:", dateInput);
      return "Invalid Date";
    }

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to check if due date is within 3 days
  const isDueSoon = (dueDateString?: string): boolean => {
    if (!dueDateString) return false;

    const dueDate = new Date(dueDateString);
    const today = new Date();

    // Set both dates to midnight for accurate day comparison
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Return true if 0-3 days left (including today)
    return diffDays >= 0 && diffDays <= 3;
  };

  const handlePayment = async (scheduleId: number) => {
    try {
      // Add this payment to processing set
      setProcessingPayments((prev) => new Set(prev).add(scheduleId));
      await processPayment(scheduleId).unwrap();
      refetch(); // Refresh the data after successful payment
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      // Remove this payment from processing set regardless of success/failure
      setProcessingPayments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(scheduleId);
        return newSet;
      });
    }
  };

  // Check if a specific payment is processing
  const isPaymentProcessing = (scheduleId: number) => {
    return processingPayments.has(scheduleId);
  };

  // Get next pending payment for each policy
  const getNextPendingPayments = () => {
    if (!myAllPolicies) return [];

    return myAllPolicies
      .map((policy) => {
        // Find the earliest PENDING payment
        const nextPayment = policy.paymentSchedules
          ?.filter((schedule) => schedule.status === "PENDING")
          .sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )[0];

        return { policy, nextPayment };
      })
      .filter((item) => item.nextPayment);
  };

  // Get payment history (paid status)
  const getPaymentHistory = () => {
    if (!myAllPolicies) return [];

    return myAllPolicies
      .flatMap(
        (policy) =>
          policy.paymentSchedules
            ?.filter((schedule) => schedule.status === "PAID")
            .map((schedule) => ({
              ...schedule,
              policy,
            })) || []
      )
      .sort(
        (a, b) =>
          new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime()
      );
  };

  const nextPendingPayments = getNextPendingPayments();
  const paymentHistory = getPaymentHistory();

  if (isLoading)
    return (
      <div className=" flex justify-center items-center ext-center mt-5 mx-auto">
        <Spinner />
      </div>
    );

  // // Check if there are any pending payments across all policies
  if (myAllPolicies?.length === 0) {
    return (
      <div className="flex justify-center items-center mt-4 text-2xl mb-5 text-blue-500 font-semibold">
        <p>No Upcoming Payments!</p>
      </div>
    );
  }

  console.log("Payment History", paymentHistory);

  return (
    <TabsContent value="payments">
      <Card className="mt-6">
        <CardHeader className="pt-4 text-center text-2xl  text-blue-500">
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Upcoming Payments Section */}
          <div className="mb-6">
            <h3 className="font-semibold  m-2 mb-3">Upcoming Payments</h3>
            <div className="space-y-4">
              {nextPendingPayments?.map(({ policy, nextPayment }) => {
                // const nextPayment = policy.paymentSchedules?.[0];
                const dueSoon = isDueSoon(nextPayment?.dueDate);
                const isProcessing = isPaymentProcessing(nextPayment.id);
                return (
                  <div
                    key={policy.id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium p-2.5">
                        Policy #{policy.productCode}
                      </p>
                      <div className="flex gap-1.5 justify-center items-center">
                        <Calendar className=" flex gap-1.5 h-4 w-4 mr-1 text-blue-500" />
                        <p className="text-sm text-gray-600 m-0">
                          Due Date:{" "}
                          <span
                            className={
                              dueSoon
                                ? "text-yellow-600 font-semibold ml-1 items-center"
                                : "text-gray-700 ml-1"
                            }
                          >
                            {formatDate(nextPayment?.dueDate)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {/* Amount: {policy.paymentSchedules?.[0]?.dueAmount || 0}{" "} */}
                        Amount: {nextPayment.dueAmount} {policy.currency}
                      </p>
                      <p>{policy.paymentFrequency}</p>

                      <button
                        className="btn btn-primary text-white rounded-2xl"
                        disabled={isProcessing}
                        onClick={() => handlePayment(nextPayment.id)}
                      >
                        {isProcessing ? "Processing..." : "Pay Now"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Payment History Section */}
          <div className="mt-5">
            <p className="font-semibold mb-4 text-center text-2xl text-blue-500">
              Payment History
            </p>
            {paymentHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No payment history found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentHistory.map(({ policy, ...schedule }) => {
                  console.log("paidDate", schedule.paidDate);

                  return (
                    <div
                      key={schedule.id}
                      className="flex justify-between items-center p-3 border rounded-lg bg-green-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium">
                            Policy #{policy.policyNumber}
                          </p>
                          <div className="flex gap-1.5 items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <p className="text-sm text-gray-600 m-0">
                              Paid on: {formatDateWithTime(schedule.paidDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {schedule.dueAmount} {schedule.currency}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {policy.paymentFrequency.toLowerCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Transaction: {schedule.transactionId || "N/A"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
