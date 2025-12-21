// charts/PolicyMetricsChart.tsx
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
}

const PolicyMetricsChart = ({ period }: PolicymetriChartProps) => {
  const { data: allPolicies, isLoading, error } = useGetAllPoliciesQuery();

  console.log("All Policies in metric chart", allPolicies);

  /**
   * Transform policy data from API into chart format
   * Groups policies by type and counts active/inactive/pending statuses
   */
  const transformPolicyData = () => {
    // If no data or loading, return sample data or empty array
    if (!allPolicies || !Array.isArray(allPolicies)) {
      return [
        {
          type: "Life Insurance",
          active: 420,
          inactive: 85,
          pending: 25,
          total: 530,
        },
        {
          type: "Auto Insurance",
          active: 320,
          inactive: 45,
          pending: 15,
          total: 380,
        },
        {
          type: "Property Insurance",
          active: 280,
          inactive: 35,
          pending: 10,
          total: 325,
        },
        {
          type: "Health Insurance",
          active: 195,
          inactive: 30,
          pending: 8,
          total: 233,
        },
        {
          type: "Travel Insurance",
          active: 120,
          inactive: 20,
          pending: 5,
          total: 145,
        },
      ];
    }

    // Initialize counts by policy type
    const policyCounts: Record<
      string,
      {
        active: number;
        inactive: number;
        pending: number;
        total: number;
      }
    > = {};

    // Process each policy to count by type and status
    allPolicies.forEach((policy: any) => {
      // Get policy type, defaulting to "Other" if not specified
      const policyType =
        policy.productType || policy.type || policy.policyType || "Other";

      // Get readable display name
      const typeDisplayName = getPolicyTypeDisplayName(policyType);

      // Get policy status (assuming you have a status field)
      // If no status field exists, we'll need to determine it from other fields
      const status = getPolicyStatus(policy);

      // Initialize type if not exists
      if (!policyCounts[typeDisplayName]) {
        policyCounts[typeDisplayName] = {
          active: 0,
          inactive: 0,
          pending: 0,
          total: 0,
        };
      }

      // Increment counts based on status
      switch (status.toLowerCase()) {
        case "active":
        case "active":
        case "issued":
        case "inforce":
          policyCounts[typeDisplayName].active++;
          break;
        case "inactive":
        case "expired":
        case "cancelled":
        case "terminated":
          policyCounts[typeDisplayName].inactive++;
          break;
        case "pending":
        case "draft":
        case "underwriting":
        case "application":
          policyCounts[typeDisplayName].pending++;
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
        return "pending";
      } else if (now > expiryDate) {
        return "inactive";
      } else {
        return "active";
      }
    }

    // Check if policy is active based on other fields
    if (policy.isActive !== undefined) {
      return policy.isActive ? "active" : "inactive";
    }

    // Default to active if no status info
    return "active";
  };

  /**
   * Get color for each bar segment
   */
  const getBarColor = (dataKey: string) => {
    const colorMap: Record<string, string> = {
      active: "#10b981", // Green
      inactive: "#64748b", // Gray
      pending: "#f59e0b", // Yellow/Orange
    };
    return colorMap[dataKey] || "#3b82f6"; // Default blue
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
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Total Policies</div>
          <div className="text-2xl font-semibold">{totalPolicies}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-semibold text-green-600">
            {totalActive}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Inactive</div>
          <div className="text-2xl font-semibold text-gray-600">
            {totalInactive}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-semibold text-amber-600">
            {totalPending}
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
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="inactive"
              name="Inactive"
              fill="#64748b"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="pending"
              name="Pending"
              fill="#f59e0b"
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
