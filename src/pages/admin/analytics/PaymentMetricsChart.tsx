// charts/PaymentMetricsChart.tsx
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

interface PaymentMetricsChartProps {
  paymentsData: {
    coming: any[];
    overdue: any[];
    paid: any[];
  };
}

const PaymentMetricsChart = ({ paymentsData }: PaymentMetricsChartProps) => {
  // Calculate payment metrics
  const paymentMetrics = [
    {
      category: "Paid",
      count: paymentsData.paid.length,
      amount: paymentsData.paid.reduce((sum, payment) => {
        const amount =
          payment.dueAmount?.amount || payment.amount || payment.dueAmount || 0;
        return sum + Number(amount);
      }, 0),
      color: "#10b981",
    },
    {
      category: "Upcoming",
      count: paymentsData.coming.length,
      amount: paymentsData.coming.reduce((sum, payment) => {
        const amount =
          payment.dueAmount?.amount || payment.amount || payment.dueAmount || 0;
        return sum + Number(amount);
      }, 0),
      color: "#3b82f6",
    },
    {
      category: "Overdue",
      count: paymentsData.overdue.length,
      amount: paymentsData.overdue.reduce((sum, payment) => {
        const amount =
          payment.dueAmount?.amount || payment.amount || payment.dueAmount || 0;
        return sum + Number(amount);
      }, 0),
      color: "#ef4444",
    },
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={paymentMetrics}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="category" stroke="#888888" fontSize={12} />
          <YAxis yAxisId="left" stroke="#888888" fontSize={12} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#888888"
            fontSize={12}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            formatter={(value: any, name: string) => {
              if (name === "Amount") {
                return [`$${Number(value).toLocaleString()}`, name];
              }
              return [value, name];
            }}
          />
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
  );
};

export default PaymentMetricsChart;
