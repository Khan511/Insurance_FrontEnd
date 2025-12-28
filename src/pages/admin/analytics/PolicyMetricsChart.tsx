import { useGetAllPoliciesQuery } from "@/services/AdminSlice";
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
type AnalyticsPeriod = "7d" | "30d" | "90d" | "1y" | "all";

interface PolicymetriChartProps {
  period?: AnalyticsPeriod;
  policiesData: any[];
}

const PolicyMetricsChart = ({
  period,
  policiesData: externalPolicyData,
}: PolicymetriChartProps) => {
  const {
    data: internalPolicyData,
    isLoading,
    error,
  } = useGetAllPoliciesQuery(undefined, { skip: !!externalPolicyData });

  const allPolicies = externalPolicyData
    ? externalPolicyData
    : internalPolicyData || [];

  console.log("All Policies in metric chart", allPolicies);

  /**
   * Transform policy data from API into chart format
   * Groups policies by type and counts active/inactive/pending statuses
   */
  const transformPolicyData = () => {
    // Initialize counts by policy type
    const policyCounts: Record<
      string,
      {
        active: number;
        inactive: number;
        pending: number;
        total: number;
        expired: number;
        cancelled: number;
      }
    > = {};

    // Process each policy to count by type and status
    allPolicies?.forEach((policy: any) => {
      // Get policy type, defaulting to "Other" if not specified
      const policyType =
        policy.productType || policy.type || policy.policyType || "Other";

      // Get readable display name
      const typeDisplayName = getPolicyTypeDisplayName(policyType);

      // Get policy status (assuming you have a status field)
      const status = getPolicyStatus(policy);

      // Initialize type if not exists
      if (!policyCounts[typeDisplayName]) {
        policyCounts[typeDisplayName] = {
          active: 0,
          inactive: 0,
          pending: 0,
          total: 0,
          expired: 0,
          cancelled: 0,
        };
      }

      // Increment counts based on status
      switch (status.toUpperCase()) {
        case "ACTIVE":
          policyCounts[typeDisplayName].active++;
          break;
        case "INACTIVE":
          policyCounts[typeDisplayName].inactive++;
          break;
        case "PENDING":
          policyCounts[typeDisplayName].pending++;
          break;
        case "EXPIRED":
          policyCounts[typeDisplayName].expired++;
          break;
        case "CANCELLED":
          policyCounts[typeDisplayName].cancelled++;
          break;
        default:
          // Default to active if status not recognized
          policyCounts[typeDisplayName].active++;
      }

      policyCounts[typeDisplayName].total++;
    });

    // Convert to array format for chart
    const chartData = Object.entries(policyCounts)
      .map(([type, counts]) => ({
        type,
        active: counts.active,
        inactive: counts.inactive,
        pending: counts.pending,
        total: counts.total,
        expired: counts.expired,
        cancelled: counts.cancelled,
      }))
      .sort((a, b) => b.total - a.total); // Sort by total count descending

    return chartData;
  };

  /**
   * Get readable display name for policy type
   */
  const getPolicyTypeDisplayName = (typeCode: string): string => {
    const typeMap: Record<string, string> = {
      LIFE: "Life Insurance",
      life: "Life Insurance",
      AUTO: "Auto Insurance",
      auto: "Auto Insurance",
      VEHICLE: "Auto Insurance",
      PROPERTY: "Property Insurance",
      property: "Property Insurance",
      HOME: "Property Insurance",
      HOMEOWNERS: "Property Insurance",
      HEALTH: "Health Insurance",
      health: "Health Insurance",
      MEDICAL: "Health Insurance",
      TRAVEL: "Travel Insurance",
      travel: "Travel Insurance",
      BUSINESS: "Business Insurance",
      COMMERCIAL: "Business Insurance",
      LIABILITY: "Liability Insurance",
      RENTERS: "Renters Insurance",
      PET: "Pet Insurance",
    };

    return (
      typeMap[typeCode.toUpperCase()] ||
      typeCode
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ") + " Insurance"
    );
  };

  /**
   * Determine policy status from policy object
   * You may need to adjust this based on your actual data structure
   */
  const getPolicyStatus = (policy: any): string => {
    // Check for direct status field
    if (policy.status) {
      return policy.status;
    }

    // Check for effective/expiry dates to determine status
    const now = new Date();

    if (policy.effectiveDate && policy.expiryDate) {
      const effectiveDate = new Date(policy.effectiveDate);
      const expiryDate = new Date(policy.expiryDate);

      if (now < effectiveDate) {
        return "PENDING";
      } else if (now > expiryDate) {
        return "EXPIRED";
      } else {
        return "ACTIVE";
      }
    }

    // Check if policy is active based on other fields
    if (policy.isActive !== undefined) {
      return policy.isActive ? "ACTIVE" : "INACTIVE";
    }

    // Default to active if no status info
    return "ACTIVE";
  };

  // Get transformed data
  const policyData = transformPolicyData();

  // Calculate totals for display
  const totalPolicies = policyData.reduce((sum, item) => sum + item.total, 0);
  const totalActive = policyData.reduce((sum, item) => sum + item.active, 0);
  const totalInactive = policyData.reduce(
    (sum, item) => sum + item.inactive,
    0
  );
  const totalPending = policyData.reduce((sum, item) => sum + item.pending, 0);
  const totalCancelled = policyData.reduce(
    (sum, item) => sum + item.cancelled,
    0
  );
  const totalExpired = policyData.reduce((sum, item) => sum + item.expired, 0);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading policy data...</p>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl">⚠️</div>
          <p className="mt-2 text-gray-600">Error loading policy data</p>
          {/* <p className="text-sm text-gray-500">Using sample data instead</p> */}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary stats - Updated with 6 boxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 mb-4">
        <div className="bg-white p-2 flex flex-col items-start justify-center rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Total Policies</div>
          <div className="text-2xl font-semibold">{totalPolicies}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border  p-2 flex flex-col items-start justify-center ">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-semibold" style={{ color: "#10b981" }}>
            {totalActive}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {totalPolicies > 0
              ? `${Math.round((totalActive / totalPolicies) * 100)}%`
              : "0%"}
          </div>
        </div>
        <div className="bg-white p-2 flex flex-col items-start justify-center  rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Inactive</div>
          <div className="text-2xl font-semibold" style={{ color: "#8b5cf6" }}>
            {totalInactive}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {totalPolicies > 0
              ? `${Math.round((totalInactive / totalPolicies) * 100)}%`
              : "0%"}
          </div>
        </div>
        <div className="bg-white p-2 flex flex-col items-start justify-center  rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-semibold" style={{ color: "#f59e0b" }}>
            {totalPending}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {totalPolicies > 0
              ? `${Math.round((totalPending / totalPolicies) * 100)}%`
              : "0%"}
          </div>
        </div>
        <div className="bg-white p-2 flex flex-col items-start justify-center  rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Cancelled</div>
          <div className="text-2xl font-semibold" style={{ color: "#ef4444" }}>
            {totalCancelled}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {totalPolicies > 0
              ? `${Math.round((totalCancelled / totalPolicies) * 100)}%`
              : "0%"}
          </div>
        </div>
        <div className="bg-white p-2 flex flex-col items-start justify-center  rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Expired</div>
          <div className="text-2xl font-semibold" style={{ color: "#6b7280" }}>
            {totalExpired}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {totalPolicies > 0
              ? `${Math.round((totalExpired / totalPolicies) * 100)}%`
              : "0%"}
          </div>
        </div>
      </div>

      {/* Data table  */}
      {allPolicies && allPolicies.length > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          <p>
            Showing data for {allPolicies.length} policy
            {allPolicies.length !== 1 ? "s" : ""} across {policyData.length}{" "}
            type{policyData.length !== 1 ? "s" : ""}
          </p>

          {period && (
            <p className="text-xs text-gray-500">
              Period: {period === "1y" ? "Last 12 months" : period}
              {period === "all" && " (All available data)"}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="h-[28rem]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={policyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            barCategoryGap="20%"
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="type"
              stroke="#888888"
              fontSize={12}
              tick={{ fill: "#555" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              label={{
                value: "Number of Policies",
                angle: -90,
                position: "insideLeft",
                offset: -10,
                style: { textAnchor: "middle", fill: "#666" },
              }}
            />
            <Tooltip
              formatter={(value: any, name: any) => {
                return [`${value} policies`, name];
              }}
              labelFormatter={(label) => `Policy Type: ${label}`}
              contentStyle={{
                backgroundColor: "white",
                border: "8px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              dataKey="active"
              name="Active"
              fill="#10b981" // Emerald
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="inactive"
              name="Inactive"
              fill="#8b5cf6" // Violet
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="pending"
              name="Pending"
              fill="#f59e0b" // Amber
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="cancelled"
              name="Cancelled"
              fill="#ef4444" // Red
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="expired"
              name="Expired"
              fill="#6b7280" // Gray
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PolicyMetricsChart;
