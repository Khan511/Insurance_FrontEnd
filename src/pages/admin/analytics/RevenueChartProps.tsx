import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
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
  approvedAmount: number | null;
  claimAmount: number | null;
  submissionDate?: string;
  approvedDate?: string;
  paidDate?: string;
  createdAt?: string;
}

const RevenueChart = ({
  period,
  detailed = false,
  paymentData = null,
  claimsData = null,
}: RevenueChartProps) => {
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
    let monthsCount = 12;

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

  // Calculate comprehensive financial metrics
  const calculateFinancialMetrics = () => {
    const months = getMonthsForPeriod(period);
    const monthlyData: Record<
      string,
      {
        premiumRevenue: number;
        approvedClaims: number;
        paidClaims: number;
        pendingClaims: number;
        rejectedClaims: number;
        totalClaimsValue: number;
        netRevenue: number;
        claimsRatio: number;
      }
    > = {};

    // Initialize months
    months.forEach((month) => {
      monthlyData[month] = {
        premiumRevenue: 0,
        approvedClaims: 0,
        paidClaims: 0,
        pendingClaims: 0,
        rejectedClaims: 0,
        totalClaimsValue: 0,
        netRevenue: 0,
        claimsRatio: 0,
      };
    });

    // Process premium payments
    if (paymentData?.paid) {
      paymentData.paid.forEach((payment: any) => {
        if (!payment.paidDate) return;

        const paidDate = toDate(payment.paidDate);
        if (!paidDate) return;

        const monthKey = paidDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        const amount = payment.dueAmount?.amount || payment.amount || 0;

        if (monthlyData[monthKey]) {
          monthlyData[monthKey].premiumRevenue += Number(amount);
        }
      });
    }

    // Process claims
    if (claimsData && Array.isArray(claimsData)) {
      claimsData.forEach((claim: ClaimData) => {
        // Get claim date (prefer submission date)
        const claimDateStr = claim.submissionDate || claim.createdAt;
        if (!claimDateStr) return;

        const claimDate = toDate(claimDateStr);
        if (!claimDate) return;

        const monthKey = claimDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        if (!monthlyData[monthKey]) return;

        const claimAmount = claim.approvedAmount || claim.claimAmount || 0;

        // Categorize by status
        switch (claim.status) {
          case "PENDING":
            monthlyData[monthKey].pendingClaims += 1;
            monthlyData[monthKey].totalClaimsValue += Number(claimAmount);
            break;
          case "UNDER_REVIEW":
            monthlyData[monthKey].pendingClaims += 1;
            monthlyData[monthKey].totalClaimsValue += Number(claimAmount);
            break;
          case "APPROVED":
            monthlyData[monthKey].approvedClaims += Number(claimAmount);
            monthlyData[monthKey].totalClaimsValue += Number(claimAmount);
            break;
          case "PAID":
            monthlyData[monthKey].paidClaims += Number(claimAmount);
            monthlyData[monthKey].totalClaimsValue += Number(claimAmount);
            break;
          case "REJECTED":
            monthlyData[monthKey].rejectedClaims += 1;
            break;
          // CANCELLED and EXPIRED don't count toward liabilities
        }
      });
    }

    // Calculate net revenue and claims ratio
    Object.keys(monthlyData).forEach((month) => {
      const data = monthlyData[month];
      data.netRevenue = data.premiumRevenue - data.paidClaims;
      data.claimsRatio =
        data.premiumRevenue > 0
          ? (data.paidClaims / data.premiumRevenue) * 100
          : 0;
    });

    return monthlyData;
  };

  // Calculate summary statistics
  const calculateSummaryStats = () => {
    if (!claimsData || !Array.isArray(claimsData)) {
      return {
        totalClaims: 0,
        approvedClaims: 0,
        paidClaims: 0,
        pendingClaims: 0,
        rejectedClaims: 0,
        totalApprovedAmount: 0,
        totalPaidAmount: 0,
        averageClaimValue: 0,
        approvalRate: 0,
        rejectionRate: 0,
      };
    }

    let total = 0;
    let approved = 0;
    let paid = 0;
    let pending = 0;
    let rejected = 0;
    let totalApprovedAmount = 0;
    let totalPaidAmount = 0;

    claimsData.forEach((claim: ClaimData) => {
      total++;
      const amount = claim.approvedAmount || claim.claimAmount || 0;

      switch (claim.status) {
        case "PENDING":
          pending++;
          break;
        case "UNDER_REVIEW":
          pending++;
          break;
        case "APPROVED":
          approved++;
          totalApprovedAmount += Number(amount);
          break;
        case "PAID":
          paid++;
          totalPaidAmount += Number(amount);
          break;
        case "REJECTED":
          rejected++;
          break;
        // CANCELLED and EXPIRED are excluded from active counts
      }
    });

    return {
      totalClaims: total,
      approvedClaims: approved,
      paidClaims: paid,
      pendingClaims: pending,
      rejectedClaims: rejected,
      totalApprovedAmount,
      totalPaidAmount,
      averageClaimValue: approved > 0 ? totalApprovedAmount / approved : 0,
      approvalRate: total > 0 ? (approved / total) * 100 : 0,
      rejectionRate: total > 0 ? (rejected / total) * 100 : 0,
    };
  };

  // Get transformed data
  const monthlyData = calculateFinancialMetrics();
  const summaryStats = calculateSummaryStats();

  // Convert to array for chart
  const chartData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
  }));

  // If no data, use sample
  const displayData = chartData;

  const currencyCode = "DKK";
  const currencySymbol = "kr";

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mb-4">
        <div className="bg-white p-1 flex  flex-col justify-center rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Premium Revenue</div>
          <div className="text-xl font-semibold text-green-600">
            {formatCurrency(
              displayData.reduce((sum, item) => sum + item.premiumRevenue, 0)
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Total collected premiums
          </div>
        </div>

        <div className="bg-white p-1 flex  flex-col justify-center rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Claims Paid</div>
          <div className="text-xl font-semibold text-red-600">
            {formatCurrency(
              displayData.reduce((sum, item) => sum + item.paidClaims, 0)
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">Total paid out</div>
        </div>

        <div className="bg-white p-1 flex  flex-col justify-center rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Net Revenue</div>
          <div className="text-xl font-semibold text-blue-600">
            {formatCurrency(
              displayData.reduce((sum, item) => sum + item.netRevenue, 0)
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">Revenue - Claims</div>
        </div>

        <div className="bg-white p-1 flex  flex-col justify-center rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Claims Ratio</div>
          <div className="text-xl font-semibold text-purple-600">
            {Math.round(
              (displayData.reduce((sum, item) => sum + item.paidClaims, 0) /
                Math.max(
                  displayData.reduce(
                    (sum, item) => sum + item.premiumRevenue,
                    0
                  ),
                  1
                )) *
                100
            )}
            %
          </div>
          <div className="text-xs text-gray-400 mt-1">Claims / Revenue</div>
        </div>
      </div>

      {/* Claims Statistics */}
      {detailed && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">Total Claims</div>
            <div className="text-lg font-semibold">
              {summaryStats.totalClaims}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">Approved</div>
            <div className="text-lg font-semibold text-green-600">
              {summaryStats.approvedClaims}
            </div>
            <div className="text-xs text-gray-400">
              {Math.round(summaryStats.approvalRate)}% rate
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">Paid</div>
            <div className="text-lg font-semibold text-blue-600">
              {summaryStats.paidClaims}
            </div>
            <div className="text-xs text-gray-400">
              {formatCurrency(summaryStats.totalPaidAmount)}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-lg font-semibold text-yellow-600">
              {summaryStats.pendingClaims}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">Rejected</div>
            <div className="text-lg font-semibold text-red-600">
              {summaryStats.rejectedClaims}
            </div>
            <div className="text-xs text-gray-400">
              {Math.round(summaryStats.rejectionRate)}% rate
            </div>
          </div>
        </div>
      )}
      {/* Data Info */}
      <div className="mt-4 text-xs text-gray-500">
        {paymentData && (
          <p>
            Showing {period} period | Premium payments:{" "}
            {paymentData.paid?.length || 0}
          </p>
        )}
      </div>
      {/* Main Chart */}
      <div className="h-80 min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={displayData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#888888" fontSize={12} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${currencySymbol}${Math.round(value / 1000)}k`;
                }
                return `${currencySymbol}${Math.round(value)}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <Area
              type="monotone"
              dataKey="premiumRevenue"
              name="Premium Revenue"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="paidClaims"
              name="Claims Paid"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.3}
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="netRevenue"
              name="Net Revenue"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Detailed Chart for Claims Breakdown */}
      {detailed && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Claims Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="approvedClaims"
                  name="Approved Claims"
                  fill="#10b981"
                  stackId="a"
                />
                <Bar
                  dataKey="paidClaims"
                  name="Paid Claims"
                  fill="#3b82f6"
                  stackId="a"
                />
                <Bar
                  dataKey="pendingClaims"
                  name="Pending Claims"
                  fill="#f59e0b"
                  stackId="a"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
