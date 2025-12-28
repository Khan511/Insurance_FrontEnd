import { useGetAllClaimsQuery } from "@/services/AdminSlice";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ClaimsDistributionChartProps {
  detailed?: boolean;
  period?: "7d" | "30d" | "90d" | "1y" | "all";
  claimsData?: any[];
}

type ChartDataItem = {
  name: string;
  value: number;
  count: number;
  amount: number;
  color: string;
} & Record<string, any>;

const ClaimsDistributionChart = ({
  detailed = false,
  period = "30d",
  claimsData: externalClaimsData,
}: ClaimsDistributionChartProps) => {
  const {
    data: internalClaimsData,
    isLoading,
    error,
  } = useGetAllClaimsQuery({}, { skip: !!externalClaimsData });
  const [activeView, setActiveView] = useState<"status" | "type">("status");
  const [totalClaims, setTotalClaims] = useState(0);
  const [totalClaimAmount, setTotalClaimAmount] = useState(0);
  const [avgProcessingDays, setAvgProcessingDays] = useState(0);
  const [approvalRate, setApprovalRate] = useState(0);
  const [showAmounts, setShowAmounts] = useState(false);

  // Use whichever data is available
  const allClaims = externalClaimsData || internalClaimsData || [];

  // Filter claims by period
  const filterClaimsByPeriod = (claims: any[]) => {
    if (!claims || claims.length === 0) return [];

    if (period === "all") {
      return claims;
    }

    const now = new Date();
    const cutoffDate = new Date();

    switch (period) {
      case "7d":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return claims;
    }

    const filtered = claims.filter((claim) => {
      let claimDate;
      if (claim.submissionDate) {
        if (Array.isArray(claim.submissionDate)) {
          const [year, month, day] = claim.submissionDate;
          claimDate = new Date(year, month - 1, day);
        } else {
          claimDate = new Date(claim.submissionDate);
        }
      } else if (claim.createdAt) {
        claimDate = new Date(claim.createdAt);
      } else {
        return true;
      }

      return claimDate >= cutoffDate;
    });

    return filtered;
  };

  // Calculate key metrics
  useEffect(() => {
    if (!allClaims || allClaims.length === 0) return;

    const filteredClaims = filterClaimsByPeriod(allClaims);
    setTotalClaims(filteredClaims.length);

    const totalAmount = filteredClaims.reduce((sum, claim) => {
      const amount =
        claim.approvedAmount ||
        claim.incidentDetails?.claimAmount ||
        (claim.incidentDetails && claim.incidentDetails.claimAmount) ||
        0;
      return sum + Number(amount);
    }, 0);
    setTotalClaimAmount(totalAmount);

    const processedClaims = filteredClaims.filter(
      (claim) => claim.isProcessed && claim.processingDays > 0
    );
    if (processedClaims.length > 0) {
      const avgDays =
        processedClaims.reduce((sum, claim) => sum + claim.processingDays, 0) /
        processedClaims.length;
      setAvgProcessingDays(Math.round(avgDays * 10) / 10);
    } else {
      setAvgProcessingDays(0);
    }

    const approvedClaims = filteredClaims.filter(
      (claim) => claim.status === "APPROVED" || claim.status === "PAID"
    ).length;
    setApprovalRate(
      filteredClaims.length > 0
        ? Math.round((approvedClaims / filteredClaims.length) * 100)
        : 0
    );
  }, [allClaims, period]);

  // Transform claims by status
  const transformClaimsByStatus = (): ChartDataItem[] => {
    if (!allClaims || allClaims.length === 0) return [];

    const filteredClaims = filterClaimsByPeriod(allClaims);
    if (filteredClaims.length === 0) return [];

    const statusCounts: Record<string, { count: number; totalAmount: number }> =
      {
        PENDING: { count: 0, totalAmount: 0 },
        UNDER_REVIEW: { count: 0, totalAmount: 0 },
        APPROVED: { count: 0, totalAmount: 0 },
        PAID: { count: 0, totalAmount: 0 },
        REJECTED: { count: 0, totalAmount: 0 },
        CANCELLED: { count: 0, totalAmount: 0 },
        EXPIRED: { count: 0, totalAmount: 0 },
      };

    filteredClaims.forEach((claim) => {
      const status = claim.status || "PENDING";
      const amount =
        claim.approvedAmount ||
        (claim.incidentDetails && claim.incidentDetails.claimAmount) ||
        0;

      if (statusCounts[status]) {
        statusCounts[status].count += 1;
        statusCounts[status].totalAmount += Number(amount);
      } else {
        statusCounts[status] = { count: 1, totalAmount: Number(amount) };
      }
    });

    const statusesWithClaims = Object.entries(statusCounts).filter(
      ([_, data]) => data.count > 0
    );

    if (statusesWithClaims.length === 0) return [];

    const totalCount = statusesWithClaims.reduce(
      (sum, [_, data]) => sum + data.count,
      0
    );
    const totalAmount = statusesWithClaims.reduce(
      (sum, [_, data]) => sum + data.totalAmount,
      0
    );

    return statusesWithClaims
      .map(([status, data]) => {
        const percentage =
          totalCount > 0 ? Math.round((data.count / totalCount) * 100) : 0;
        const amountPercentage =
          totalAmount > 0
            ? Math.round((data.totalAmount / totalAmount) * 100)
            : 0;

        return {
          name: formatStatusName(status),
          value: showAmounts ? amountPercentage : percentage,
          count: data.count,
          amount: data.totalAmount,
          color: getStatusColor(status),
        } as ChartDataItem;
      })
      .sort((a, b) => b.value - a.value);
  };

  // Transform claims by type
  const transformClaimsByType = (): ChartDataItem[] => {
    if (!allClaims || allClaims.length === 0) return [];

    const filteredClaims = filterClaimsByPeriod(allClaims);
    const typeGroups: Record<string, { count: number; totalAmount: number }> =
      {};

    filteredClaims.forEach((claim) => {
      const type =
        claim.claimType ||
        (claim.incidentDetails && claim.incidentDetails.type) ||
        "OTHER";
      const amount =
        claim.approvedAmount ||
        (claim.incidentDetails && claim.incidentDetails.claimAmount) ||
        0;

      const formattedType = formatClaimType(type);
      if (!typeGroups[formattedType]) {
        typeGroups[formattedType] = { count: 0, totalAmount: 0 };
      }

      typeGroups[formattedType].count += 1;
      typeGroups[formattedType].totalAmount += Number(amount);
    });

    const typeEntries = Object.entries(typeGroups);
    if (typeEntries.length === 0) return [];

    const totalCount = typeEntries.reduce(
      (sum, [_, data]) => sum + data.count,
      0
    );
    const totalAmount = typeEntries.reduce(
      (sum, [_, data]) => sum + data.totalAmount,
      0
    );

    return typeEntries
      .map(([type, data]) => {
        const percentage = Math.round((data.count / totalCount) * 100);
        const amountPercentage =
          totalAmount > 0
            ? Math.round((data.totalAmount / totalAmount) * 100)
            : 0;

        return {
          name: type,
          value: showAmounts ? amountPercentage : percentage,
          count: data.count,
          amount: data.totalAmount,
          color: getTypeColor(type),
        } as ChartDataItem;
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  // Helper functions (keep these the same)
  const formatStatusName = (status: string): string => {
    const statusMap: Record<string, string> = {
      PENDING: "Pending",
      UNDER_REVIEW: "Under Review",
      APPROVED: "Approved",
      PAID: "Paid",
      REJECTED: "Rejected",
      CANCELLED: "Cancelled",
      EXPIRED: "Expired",
    };
    return statusMap[status] || status;
  };

  const formatClaimType = (type: string): string => {
    const typeMap: Record<string, string> = {
      HEALTH_HOSPITALIZATION: "Health/Hospitalization",
      AUTO_ACCIDENT: "Auto Accident",
      HOME_DAMAGE: "Home Damage",
      THEFT: "Theft",
      FIRE: "Fire",
      LIABILITY: "Liability",
      PROPERTY: "Property Damage",
      MEDICAL: "Medical",
      TRAVEL: "Travel",
      LIFE: "Life",
    };
    return typeMap[type] || type;
  };

  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      PENDING: "#f59e0b",
      UNDER_REVIEW: "#3b82f6",
      APPROVED: "#10b981",
      PAID: "#059669",
      REJECTED: "#ef4444",
      CANCELLED: "#6b7280",
      EXPIRED: "#9ca3af",
    };
    return colorMap[status] || "#64748b";
  };

  const getTypeColor = (type: string): string => {
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#14b8a6",
      "#f97316",
      "#64748b",
      "#84cc16",
    ];
    const hash = type
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {showAmounts ? "Amount Share" : "Claim Share"}: {data.value}%
          </p>
          <p className="text-sm text-gray-600">
            Number of Claims: {data.count}
          </p>
          {data.amount > 0 && (
            <p className="text-sm text-gray-600">
              Total Amount: {formatCurrency(data.amount)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const statusData = transformClaimsByStatus();
  const typeData = transformClaimsByType();

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-500">Loading claims data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-red-500">Error loading claims data</div>
      </div>
    );
  }

  if (!allClaims || allClaims.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-500">No claims data available</div>
      </div>
    );
  }

  return (
    <div className="h-[28rem] flex flex-col">
      {/* Header with metrics */}
      <div className="flex-none mb-2">
        <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveView("status")}
              className={`px-3 py-1 text-sm rounded ${
                activeView === "status"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              By Status
            </button>
            <button
              onClick={() => setActiveView("type")}
              className={`px-3 py-1 text-sm rounded ${
                activeView === "type"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              By Type
            </button>
            <button
              onClick={() => setShowAmounts(!showAmounts)}
              className={`px-3 py-1 text-sm rounded ${
                showAmounts
                  ? "bg-purple-100 text-purple-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {showAmounts ? "Show Counts" : "Show Amounts"}
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Period: {period.toUpperCase()} | Showing:{" "}
            {showAmounts ? "Amounts" : "Counts"}
          </div>
        </div>

        {/* Metrics summary */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-blue-50 p-2 rounded text-center">
            <div className="text-xs text-gray-600">Total Claims</div>
            <div className="font-semibold">{totalClaims}</div>
          </div>
          <div className="bg-green-50 p-2 rounded text-center">
            <div className="text-xs text-gray-600">Total Amount</div>
            <div className="font-semibold">
              {formatCurrency(totalClaimAmount)}
            </div>
          </div>
          <div className="bg-yellow-50 p-2 rounded text-center">
            <div className="text-xs text-gray-600">Avg Processing</div>
            <div className="font-semibold">{avgProcessingDays} days</div>
          </div>
          <div className="bg-purple-50 p-2 rounded text-center">
            <div className="text-xs text-gray-600">Approval Rate</div>
            <div className="font-semibold">{approvalRate}%</div>
          </div>
        </div>
      </div>

      {/* Main chart area - Takes available space */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {activeView === "status" ? (
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={detailed ? 60 : 40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={(entry: any) => `${entry.name}: ${entry.value}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          ) : (
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={detailed ? 60 : 40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={(entry: any) => `${entry.name}: ${entry.value}%`}
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer info - Now properly contained */}
      <div className="flex-none mt-2">
        {activeView === "status" && (
          <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
            <div className="font-medium mb-1">Status Distribution:</div>
            <div className="flex flex-wrap gap-2">
              {statusData.map((item, idx) => (
                <div key={idx} className="flex items-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span>{item.name}:</span>
                  <span className="font-semibold ml-1">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeView === "type" && (
          <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
            <div className="font-medium mb-1">Claim Types:</div>
            <div className="flex flex-wrap gap-2">
              {typeData.map((item, idx) => (
                <div key={idx} className="flex items-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span>{item.name}:</span>
                  <span className="font-semibold ml-1">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimsDistributionChart;
