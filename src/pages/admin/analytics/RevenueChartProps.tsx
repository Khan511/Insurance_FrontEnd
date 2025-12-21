// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// interface RevenueChartProps {
//   period: string;
//   detailed?: boolean;
//   paymentData?: any; // Add payment data prop
//   claimsData?: any; // Add claims data prop
// }

// const RevenueChart = ({
//   period,
//   detailed = false,
//   paymentData = null,
//   claimsData = null,
// }: RevenueChartProps) => {
//   // Transform real payment data into chart format
//   const transformPaymentData = () => {
//     if (!paymentData?.paid) return [];

//     // Group payments by month
//     const monthlyData: Record<string, { revenue: number; claims?: number }> =
//       {};

//     // Initialize months for the selected period
//     const months = getMonthsForPeriod(period);
//     months.forEach((month) => {
//       monthlyData[month] = { revenue: 0, claims: 0 };
//     });

//     // Sum revenue by month
//     paymentData.paid.forEach((payment: any) => {
//       if (!payment.paidDate) return;

//       const paidDate = toDate(payment.paidDate);
//       if (!paidDate) return;

//       const monthKey = paidDate.toLocaleDateString("en-US", { month: "short" });
//       const year = paidDate.getFullYear();
//       const fullMonthKey = `${monthKey} ${year}`;

//       const amount = payment.dueAmount?.amount || 0;

//       if (monthlyData[fullMonthKey]) {
//         monthlyData[fullMonthKey].revenue += Number(amount);
//       }
//     });

//     // Convert to array format for chart
//     return Object.entries(monthlyData)
//       .map(([month, data]) => ({
//         month,
//         revenue: data.revenue,
//         claims: data.claims,
//       }))
//       .filter((item) => item.revenue > 0 || (item.claims && item.claims > 0));
//   };

//   // Helper function to convert date
//   const toDate = (value: any) => {
//     if (!value) return null;

//     if (Array.isArray(value)) {
//       const [y, m, d, h = 0, min = 0] = value;
//       return new Date(y, m - 1, d, h, min);
//     }

//     const dt = new Date(value);
//     return isNaN(dt.getTime()) ? null : dt;
//   };

//   // Get months for the selected period
//   const getMonthsForPeriod = (period: string) => {
//     const now = new Date();
//     const months: string[] = [];
//     let monthsCount = 12; // Default for 1 year

//     switch (period) {
//       case "7d":
//         // For 7 days, show last 30 days for context
//         monthsCount = 1;
//         break;
//       case "30d":
//         monthsCount = 2;
//         break;
//       case "90d":
//         monthsCount = 4;
//         break;
//       case "1y":
//         monthsCount = 12;
//         break;
//       case "all":
//         // For all time, show last 24 months
//         monthsCount = 24;
//         break;
//     }

//     for (let i = monthsCount - 1; i >= 0; i--) {
//       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       const monthName = date.toLocaleDateString("en-US", {
//         month: "short",
//         year: "numeric",
//       });
//       months.push(monthName);
//     }

//     return months;
//   };

//   // // Use real data if available, otherwise use sample data
//   const chartData = paymentData && transformPaymentData();

//   const currencyCode = "DKK";
//   const currencySymbol = "kr";

//   return (
//     <div className="h-80 min-h-[320px]">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart
//           data={chartData}
//           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//           <XAxis dataKey="month" stroke="#888888" fontSize={12} />
//           <YAxis
//             stroke="#888888"
//             fontSize={12}
//             tickFormatter={(value) => {
//               if (value >= 1000) {
//                 return `${currencyCode}${Math.round(value / 1000)}k`;
//               }
//               return `${currencyCode}${Math.round(value)}`;
//             }}
//           />

//           <Tooltip
//             formatter={(value, name) => {
//               const formattedValue = new Intl.NumberFormat("en-US", {
//                 style: "currency",
//                 currency: currencyCode,
//                 minimumFractionDigits: 0,
//                 maximumFractionDigits: 2,
//               }).format(Number(value));
//               return [formattedValue, name];
//             }}
//             labelFormatter={(label) => `Month: ${label}`}
//           />

//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="revenue"
//             name="Revenue"
//             stroke="#2563eb"
//             strokeWidth={2}
//             dot={{ r: 4 }}
//             activeDot={{ r: 6 }}
//           />

//           {detailed && (
//             <Line
//               type="monotone"
//               dataKey="claims"
//               name="Claims Paid"
//               stroke="#ef4444"
//               strokeWidth={2}
//               strokeDasharray="5 5"
//             />
//           )}
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default RevenueChart;

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  period: string;
  detailed?: boolean;
  paymentData?: any;
  claimsData?: any;
}

interface ClaimData {
  policyNumber: string;
  claimNumber: string;
  status: string;
  amount: number | null;
  claimDate?: string; // Make sure your claims have a date field
  paidDate?: string; // If claims have a paid date
  submissionDate?: string; // Alternative date field
  createdAt?: string; // Another alternative
  // ... other fields
}

const RevenueChart = ({
  period,
  detailed = false,
  paymentData = null,
  claimsData = null,
}: RevenueChartProps) => {
  // Transform real payment data into chart format
  const transformPaymentData = () => {
    if (!paymentData?.paid) return [];

    // Group payments by month
    const monthlyData: Record<string, { revenue: number; claims: number }> = {};

    // Initialize months for the selected period
    const months = getMonthsForPeriod(period);
    months.forEach((month) => {
      monthlyData[month] = { revenue: 0, claims: 0 };
    });

    // Sum revenue by month from payments
    paymentData.paid.forEach((payment: any) => {
      if (!payment.paidDate) return;

      const paidDate = toDate(payment.paidDate);
      if (!paidDate) return;

      const monthKey = paidDate.toLocaleDateString("en-US", { month: "short" });
      const year = paidDate.getFullYear();
      const fullMonthKey = `${monthKey} ${year}`;

      const amount = payment.dueAmount?.amount || 0;

      if (monthlyData[fullMonthKey]) {
        monthlyData[fullMonthKey].revenue += Number(amount);
      }
    });

    // Sum claims paid by month from claims data
    if (claimsData && Array.isArray(claimsData)) {
      claimsData.forEach((claim: ClaimData) => {
        // Only process APPROVED claims as paid
        if (claim.status !== "APPROVED") return;

        // Try to get claim date from various fields
        const claimDateStr =
          claim.paidDate ||
          claim.claimDate ||
          claim.submissionDate ||
          claim.createdAt;
        if (!claimDateStr) return;

        const claimDate = toDate(claimDateStr);
        if (!claimDate) return;

        const monthKey = claimDate.toLocaleDateString("en-US", {
          month: "short",
        });
        const year = claimDate.getFullYear();
        const fullMonthKey = `${monthKey} ${year}`;

        // Use claim amount or default to 0
        const claimAmount = claim.amount || 0;

        if (monthlyData[fullMonthKey]) {
          monthlyData[fullMonthKey].claims += Number(claimAmount);
        }
      });
    }

    // Convert to array format for chart
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        claims: data.claims,
      }))
      .filter((item) => item.revenue > 0 || item.claims > 0);
  };

  // Alternative: If you want to show claims by status over time
  const transformClaimsByStatusOverTime = () => {
    if (!claimsData || !Array.isArray(claimsData)) return null;

    const months = getMonthsForPeriod(period);
    const monthlyClaims: Record<
      string,
      {
        approved: number;
        pending: number;
        rejected: number;
        underReview: number;
      }
    > = {};

    // Initialize all months
    months.forEach((month) => {
      monthlyClaims[month] = {
        approved: 0,
        pending: 0,
        rejected: 0,
        underReview: 0,
      };
    });

    claimsData.forEach((claim: ClaimData) => {
      // Try to get claim date
      const claimDateStr =
        claim.claimDate || claim.submissionDate || claim.createdAt;
      if (!claimDateStr) return;

      const claimDate = toDate(claimDateStr);
      if (!claimDate) return;

      const monthKey = claimDate.toLocaleDateString("en-US", {
        month: "short",
      });
      const year = claimDate.getFullYear();
      const fullMonthKey = `${monthKey} ${year}`;

      if (monthlyClaims[fullMonthKey]) {
        switch (claim.status) {
          case "APPROVED":
            monthlyClaims[fullMonthKey].approved++;
            break;
          case "PENDING":
            monthlyClaims[fullMonthKey].pending++;
            break;
          case "REJECTED":
            monthlyClaims[fullMonthKey].rejected++;
            break;
          case "UNDER_REVIEW":
            monthlyClaims[fullMonthKey].underReview++;
            break;
        }
      }
    });

    // Convert to array format
    return Object.entries(monthlyClaims)
      .map(([month, data]) => ({
        month,
        ...data,
        totalClaims:
          data.approved + data.pending + data.rejected + data.underReview,
      }))
      .filter((item) => item.totalClaims > 0);
  };

  // Helper function to convert date
  const toDate = (value: any) => {
    if (!value) return null;

    if (Array.isArray(value)) {
      const [y, m, d, h = 0, min = 0] = value;
      return new Date(y, m - 1, d, h, min);
    }

    const dt = new Date(value);
    return isNaN(dt.getTime()) ? null : dt;
  };

  // Get months for the selected period
  const getMonthsForPeriod = (period: string) => {
    const now = new Date();
    const months: string[] = [];
    let monthsCount = 12; // Default for 1 year

    switch (period) {
      case "7d":
        monthsCount = 1;
        break;
      case "30d":
        monthsCount = 2;
        break;
      case "90d":
        monthsCount = 4;
        break;
      case "1y":
        monthsCount = 12;
        break;
      case "all":
        monthsCount = 24;
        break;
    }

    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      months.push(monthName);
    }

    return months;
  };

  // Calculate total approved claims amount
  const calculateTotalApprovedClaims = () => {
    if (!claimsData || !Array.isArray(claimsData)) return 0;

    return claimsData
      .filter((claim: ClaimData) => claim.status === "APPROVED")
      .reduce(
        (total: number, claim: ClaimData) => total + (claim.amount || 0),
        0
      );
  };

  // Calculate claims statistics
  const calculateClaimsStats = () => {
    if (!claimsData || !Array.isArray(claimsData)) {
      return {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        underReview: 0,
        approvedAmount: 0,
      };
    }

    let approved = 0;
    let pending = 0;
    let rejected = 0;
    let underReview = 0;
    let approvedAmount = 0;

    claimsData.forEach((claim: ClaimData) => {
      switch (claim.status) {
        case "APPROVED":
          approved++;
          approvedAmount += claim.amount || 0;
          break;
        case "PENDING":
          pending++;
          break;
        case "REJECTED":
          rejected++;
          break;
        case "UNDER_REVIEW":
          underReview++;
          break;
      }
    });

    return {
      total: claimsData.length,
      approved,
      pending,
      rejected,
      underReview,
      approvedAmount,
    };
  };

  // Get transformed data
  const chartData = paymentData ? transformPaymentData() : [];
  const claimsByStatusData = transformClaimsByStatusOverTime();
  const claimsStats = calculateClaimsStats();

  // If no data is available, use sample data
  const displayData =
    chartData.length > 0
      ? chartData
      : claimsByStatusData && claimsByStatusData.length > 0
      ? claimsByStatusData.map((item) => ({
          month: item.month,
          revenue: 0,
          claims: item.approved * 1000, // Example conversion if you want to show claims count as amount
        }))
      : [
          { month: "Jan", revenue: 21500, claims: 4500 },
          { month: "Feb", revenue: 22800, claims: 5200 },
          { month: "Mar", revenue: 24500, claims: 4800 },
          { month: "Apr", revenue: 23200, claims: 5100 },
          { month: "May", revenue: 25100, claims: 4900 },
          { month: "Jun", revenue: 26800, claims: 5300 },
          { month: "Jul", revenue: 27500, claims: 5500 },
          { month: "Aug", revenue: 28200, claims: 5600 },
          { month: "Sep", revenue: 29500, claims: 5800 },
          { month: "Oct", revenue: 30800, claims: 6000 },
          { month: "Nov", revenue: 32200, claims: 6200 },
          { month: "Dec", revenue: 33500, claims: 6400 },
        ];

  const currencyCode = "DKK";
  const currencySymbol = "kr";

  // Check if we're showing claims by status instead of revenue
  const isShowingClaimsByStatus =
    !paymentData && claimsByStatusData && claimsByStatusData.length > 0;

  return (
    <div>
      {/* Claims Statistics Summary */}
      {detailed && claimsData && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">Total Claims</div>
            <div className="text-lg font-semibold">{claimsStats.total}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">Approved</div>
            <div className="text-lg font-semibold text-green-600">
              {claimsStats.approved}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-lg font-semibold text-yellow-600">
              {claimsStats.pending}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">Under Review</div>
            <div className="text-lg font-semibold text-blue-600">
              {claimsStats.underReview}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">Rejected</div>
            <div className="text-lg font-semibold text-red-600">
              {claimsStats.rejected}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">Approved Amount</div>
            <div className="text-lg font-semibold text-purple-600">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currencyCode,
                minimumFractionDigits: 0,
              }).format(claimsStats.approvedAmount)}
            </div>
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div className="h-80 min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#888888" fontSize={12} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickFormatter={(value) => {
                if (isShowingClaimsByStatus) {
                  // If showing claims by status (count), don't format as currency
                  return Math.round(value).toString();
                }
                if (value >= 1000) {
                  return `${currencySymbol}${Math.round(value / 1000)}k`;
                }
                return `${currencySymbol}${Math.round(value)}`;
              }}
            />

            <Tooltip
              formatter={(value, name) => {
                if (isShowingClaimsByStatus) {
                  // For claims by status, show count
                  return [`${value} claims`, name];
                }
                const formattedValue = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currencyCode,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(Number(value));
                return [formattedValue, name];
              }}
              labelFormatter={(label) => `Month: ${label}`}
            />

            <Legend />
            {!isShowingClaimsByStatus && (
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}

            {detailed && (
              <>
                {isShowingClaimsByStatus ? (
                  // If showing claims by status, show multiple lines
                  <>
                    <Line
                      type="monotone"
                      dataKey="approved"
                      name="Approved Claims"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pending"
                      name="Pending Claims"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="underReview"
                      name="Under Review"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="2 2"
                      dot={{ r: 3 }}
                    />
                  </>
                ) : (
                  // Otherwise show claims paid line
                  <Line
                    type="monotone"
                    dataKey="claims"
                    name="Claims Paid"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Info */}
      <div className="mt-2 text-xs text-gray-500">
        {paymentData && (
          <p>
            Showing revenue from {paymentData.paid?.length || 0} payment
            {paymentData.paid?.length !== 1 ? "s" : ""}
          </p>
        )}
        {claimsData && (
          <p>
            Showing {claimsStats.approved} approved claims as paid out of{" "}
            {claimsStats.total} total claims
          </p>
        )}
        {!paymentData && !claimsData && (
          <p>Using sample data - connect to real data source</p>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
