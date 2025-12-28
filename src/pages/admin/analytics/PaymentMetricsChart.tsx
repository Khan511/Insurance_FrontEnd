import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

interface PaymentMetricsChartProps {
  paymentsData: {
    coming: any[];
    overdue: any[];
    paid: any[];
  };
  period?: "30d" | "90d" | "1y" | "all";
}

interface Payment {
  id: number;
  policyNumber: string;
  customerName: string;
  amount: number;
  dueAmount?: { amount: number };
  status: "PAID" | "PENDING" | "OVERDUE" | "FAILED";
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  createdAt?: string;
}

const PaymentMetricsChart = ({
  paymentsData,
  period = "90d",
}: PaymentMetricsChartProps) => {
  const [activeTab, setActiveTab] = useState<"overview">("overview");

  // Helper function to calculate days between dates
  const calculateDaysBetween = (date1: string, date2?: string): number => {
    const d1 = new Date(date1);
    const d2 = date2 ? new Date(date2) : new Date();
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate payment metrics
  const paymentMetrics = [
    {
      category: "Paid",
      count: paymentsData.paid.length,
      amount: paymentsData.paid.reduce((sum, payment: Payment) => {
        const amount = payment.dueAmount?.amount || payment.amount || 0;
        return sum + Number(amount);
      }, 0),
      color: "#10b981",
    },
    {
      category: "Upcoming",
      count: paymentsData.coming.length,
      amount: paymentsData.coming.reduce((sum, payment: Payment) => {
        const amount = payment.dueAmount?.amount || payment.amount || 0;
        return sum + Number(amount);
      }, 0),
      color: "#3b82f6",
    },
    {
      category: "Overdue",
      count: paymentsData.overdue.length,
      amount: paymentsData.overdue.reduce((sum, payment: Payment) => {
        const amount = payment.dueAmount?.amount || payment.amount || 0;
        return sum + Number(amount);
      }, 0),
      color: "#ef4444",
    },
  ];

  // Calculate statistics
  const stats = {
    totalPaid: paymentMetrics[0].amount,
    totalUpcoming: paymentMetrics[1].amount,
    totalOverdue: paymentMetrics[2].amount,
    collectionRate:
      paymentMetrics[0].amount > 0
        ? (paymentMetrics[0].amount /
            (paymentMetrics[0].amount + paymentMetrics[2].amount)) *
          100
        : 0,
    averagePayment:
      paymentMetrics[0].count > 0
        ? paymentMetrics[0].amount / paymentMetrics[0].count
        : 0,
    onTimeRate: calculateOnTimeRate(),
    agingOverdue: calculateAverageDaysOverdue(),
    revenueForecast: paymentMetrics[0].amount + paymentMetrics[1].amount,
    totalActivePayments: paymentMetrics.reduce((sum, m) => sum + m.count, 0),
  };

  // Calculate on-time payment rate
  function calculateOnTimeRate(): number {
    const paidPayments = paymentsData.paid.filter(
      (p: Payment) => p.paidDate && p.dueDate
    );
    if (paidPayments.length === 0) return 0;

    const onTimePayments = paidPayments.filter((p: Payment) => {
      const paidDate = new Date(p.paidDate!);
      const dueDate = new Date(p.dueDate);
      return paidDate <= dueDate;
    });

    return (onTimePayments.length / paidPayments.length) * 100;
  }

  // Calculate average days overdue
  function calculateAverageDaysOverdue(): number {
    if (paymentsData.overdue.length === 0) return 0;

    const totalDays = paymentsData.overdue.reduce((sum, payment: Payment) => {
      return sum + calculateDaysBetween(payment.dueDate);
    }, 0);

    return Math.round(totalDays / paymentsData.overdue.length);
  }

  // Enhanced tooltip
  const EnhancedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = paymentMetrics.find((item) => item.category === label);
      const avgAmount = data ? data.amount / (data.count || 1) : 0;

      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm flex justify-between">
              <span className="font-medium text-gray-600">Count:</span>
              <span>{data?.count || 0}</span>
            </p>
            <p className="text-sm flex justify-between">
              <span className="font-medium text-gray-600">Average:</span>
              <span>DKK{Math.round(avgAmount).toLocaleString()}</span>
            </p>
            <p className="text-sm flex justify-between">
              <span className="font-medium text-gray-600">Total:</span>
              <span className="font-semibold">
                DKK {data ? data.amount.toLocaleString() : 0}
              </span>
            </p>

            {label === "Paid" && (
              <p className="text-sm text-green-600 mt-2">
                ✅ {Math.round(stats.collectionRate)}% collection rate
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Collection Rate</div>
          <div className="text-xl font-semibold text-green-600">
            {Math.round(stats.collectionRate)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Paid / (Paid + Overdue)
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Avg. Payment</div>
          <div className="text-xl font-semibold text-blue-600">
            {formatCurrency(stats.averagePayment)}
          </div>
          <div className="text-xs text-gray-400 mt-1">Per transaction</div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">On-Time Rate</div>
          <div className="text-xl font-semibold text-purple-600">
            {Math.round(stats.onTimeRate)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Paid on or before due
          </div>
        </div>

        {/* <div className="bg-white p-3 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Aging Overdue</div>
          <div className="text-xl font-semibold text-orange-600">
            {stats.agingOverdue} days
          </div>
          <div className="text-xs text-gray-400 mt-1">Average days overdue</div>
        </div> */}

        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Revenue Forecast</div>
          <div className="text-xl font-semibold text-cyan-600">
            {formatCurrency(stats.revenueForecast)}
          </div>
          <div className="text-xs text-gray-400 mt-1">Paid + Upcoming</div>
        </div>
      </div>

      {/* Tabs for different views */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
        </nav>
      </div>

      {/* Main Chart Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Main Bar Chart */}
          <div className="h-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Payment Overview</h3>
              <div className="text-sm text-gray-500">
                Total Active Payments: {stats.totalActivePayments}
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={paymentMetrics}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#888888" fontSize={12} />
                <YAxis
                  yAxisId="left"
                  stroke="#888888"
                  fontSize={12}
                  label={{ value: "Count", angle: -90, position: "insideLeft" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#888888"
                  fontSize={12}
                  label={{
                    value: "Amount (DKK)",
                    angle: 90,
                    position: "insideRight",
                  }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip content={<EnhancedTooltip />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="count"
                  name="Number of Payments"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="amount"
                  name="Total Amount"
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Data Summary Footer */}
      <div className="mt-4 text-xs text-gray-500 border-t pt-3">
        <div className="flex justify-between">
          <div>
            Data as of {new Date().toLocaleDateString()} | Period: {period} |
            Total Records: {stats.totalActivePayments}
          </div>
          <div className="text-right">
            {paymentsData.overdue.length > 0 && (
              <span className="text-red-600">
                ⚠️ {paymentsData.overdue.length} overdue accounts need attention
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMetricsChart;
