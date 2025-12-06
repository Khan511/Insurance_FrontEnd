import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllPaymentsQuery } from "@/services/AdminSlice";
import { useState } from "react";

export type Payment = {
  id: number;
  customer: string;
  policyNumber: string;
  dueAmount: {
    amount: number;
    currency: string;
  };
  currency: string;
  dueDate: string;
  paidDate?: string;
  status?: "PAID" | "PENDING" | "OVERDUE" | "FAILED";
};

type PaymentData = {
  coming: Payment[];
  overdue: Payment[];
  paid: Payment[];
};

const AdminPayments = () => {
  const { data, isLoading } = useGetAllPaymentsQuery();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading payments...</div>;
  }

  if (!data) {
    return (
      <div className="flex justify-center p-8">No payment data available</div>
    );
  }

  const paymentData = data as PaymentData;

  // Calculate statistics
  const totalComingAmount = paymentData.coming.reduce(
    (sum, payment) => sum + payment.dueAmount.amount,
    0
  );
  const totalOverdueAmount = paymentData.overdue.reduce(
    (sum, payment) => sum + payment.dueAmount.amount,
    0
  );
  const totalPaidAmount = paymentData.paid.reduce(
    (sum, payment) => sum + payment.dueAmount.amount,
    0
  );

  const totalPayments =
    paymentData.coming.length +
    paymentData.overdue.length +
    paymentData.paid.length;
  const successRate =
    totalPayments > 0
      ? ((paymentData.paid.length / totalPayments) * 100).toFixed(1)
      : "0";

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PAID: { color: "bg-green-100 text-green-800 p-1", label: "Paid" },
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 p-1",
        label: "Pending",
      },
      OVERDUE: { color: "bg-red-100 text-red-800 p-1", label: "Overdue" },
      FAILED: { color: "bg-gray-100 text-gray-800 p-1", label: "Failed" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  type DateTuple = [number, number, number, number?, number?];

  function toDate(value?: DateTuple | string) {
    if (!value) return null;

    if (Array.isArray(value)) {
      const [y, m, d, h = 0, min = 0] = value;
      return new Date(y, m - 1, d, h, min);
    }

    const dt = new Date(value);
    return isNaN(dt.getTime()) ? null : dt;
  }

  function formatDateTime(value?: DateTuple | string, locale = "en-GB") {
    const dt = toDate(value);
    if (!dt) return "";
    const date = dt.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return `${date}`;
  }

  console.log("Admin payments", data);

  const PaymentTable = ({
    payments,
    title,
    defaultStatus,
  }: {
    payments: Payment[];
    title: string;
    defaultStatus?: string;
  }) => (
    <Card className="p-2">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <Badge className="p-1 text-white bg-gray-500">
            {payments.length} payments
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">Policy Number</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium">Amount</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Due Date</th>
                <th className="text-left p-4 font-medium">Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">#{payment.id}</td>
                  <td className="p-4 font-mono">{payment.policyNumber}</td>
                  <td className="p-4">{payment.customer}</td>
                  <td className="p-4 font-medium">
                    {formatCurrency(
                      payment.dueAmount.amount,
                      payment.dueAmount.currency || payment.currency
                    )}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(
                      defaultStatus || payment.status || "PENDING"
                    )}
                  </td>
                  <td className="p-4">{formatDateTime(payment.dueDate)}</td>
                  <td className="p-4">
                    {/* {payment.paidDate ? formatDate(payment.paidDate) : "-"} */}
                    {payment.paidDate ? formatDateTime(payment.paidDate) : "-"}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <p className="text-2xl font-semibold text-grau-600 mt-2 mb-0">Payments</p>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-500">Total Collected</p>
            <p className="text-2xl font-bold">
              {formatCurrency(
                totalPaidAmount,
                paymentData.paid[0]?.dueAmount.currency || "DKK"
              )}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {paymentData.paid.length} paid payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-500">
              Pending Payments
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(
                totalComingAmount,
                paymentData.coming[0]?.dueAmount.currency || "DKK"
              )}
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              {paymentData.coming.length} upcoming payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-500">Overdue</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(
                totalOverdueAmount,
                paymentData.overdue[0]?.dueAmount.currency || "DKK"
              )}
            </p>
            <p className="text-xs text-red-600 mt-1">
              {paymentData.overdue.length} overdue payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-500">Success Rate</p>
            <p className="text-2xl font-bold">{successRate}%</p>
            <p className="text-xs text-gray-600 mt-1">
              Based on {totalPayments} total payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different payment types */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="coming">
            Coming ({paymentData.coming.length})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue ({paymentData.overdue.length})
          </TabsTrigger>
          <TabsTrigger value="paid">
            Paid ({paymentData.paid.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PaymentTable
              payments={paymentData.overdue}
              title="Overdue Payments"
              defaultStatus="OVERDUE"
            />
            <PaymentTable
              payments={paymentData.coming.slice(0, 5)}
              title="Upcoming Payments"
              defaultStatus="PENDING"
            />
          </div>
          <PaymentTable
            payments={paymentData.paid}
            title="Recently Paid"
            defaultStatus="PAID"
          />
        </TabsContent>

        {/* Coming Payments Tab */}
        <TabsContent value="coming">
          <PaymentTable
            payments={paymentData.coming}
            title="All Upcoming Payments"
            defaultStatus="PENDING"
          />
        </TabsContent>

        {/* Overdue Payments Tab */}
        <TabsContent value="overdue">
          <PaymentTable
            payments={paymentData.overdue}
            title="All Overdue Payments"
            defaultStatus="OVERDUE"
          />
        </TabsContent>

        {/* Paid Payments Tab */}
        <TabsContent value="paid">
          <PaymentTable
            payments={paymentData.paid}
            title="All Paid Payments"
            defaultStatus="PAID"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPayments;
