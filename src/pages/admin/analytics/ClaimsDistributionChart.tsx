import { useGetAllClaimsQuery } from "@/services/AdminSlice";
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
  // Real data props
  claimsData?: any;
  paymentData?: any; // Optional: if you need payment-related claims data
}

const ClaimsDistributionChart = ({
  detailed = false,
  claimsData = null,
  paymentData = null,
}: ClaimsDistributionChartProps) => {
  const { data: allClaims } = useGetAllClaimsQuery();
  /**
   * Transform real claims data into distribution by status
   * This function processes the actual claims data and categorizes by status
   */
  const transformClaimsByStatus = () => {
    // Return sample data if no real data provided
    if (!allClaims || !Array.isArray(allClaims)) {
      return [
        { name: "Approved", value: 65, color: "#10b981" },
        { name: "Pending", value: 18, color: "#f59e0b" },
        { name: "Under Review", value: 12, color: "#3b82f6" },
        { name: "Rejected", value: 5, color: "#ef4444" },
      ];
    }

    // Initialize counters for each status
    const statusCounts: Record<string, number> = {
      Approved: 0,
      Pending: 0,
      "Under Review": 0,
      Rejected: 0,
      // Paid: 0,
      // Processing: 0,
      // Denied: 0,
    };

    // Count claims by status
    allClaims.forEach((claim: any) => {
      const status = claim.status || "Pending";
      const normalizedStatus = normalizeStatus(status);

      if (statusCounts[normalizedStatus] !== undefined) {
        statusCounts[normalizedStatus]++;
      } else {
        // For any unexpected status, group as "Other"
        statusCounts["Pending"] = (statusCounts["Pending"] || 0) + 1;
      }
    });

    // Calculate total for percentages
    const totalClaims = Object.values(statusCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    // Filter out statuses with 0 claims and convert to percentage
    const result = Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => {
        const percentage = Math.round((count / totalClaims) * 100);
        return {
          name: status,
          value: percentage,
          count: count,
          color: getStatusColor(status),
        };
      })
      .sort((a, b) => b.value - a.value); // Sort by percentage descending

    return result;
  };

  console.log("All Claims in Claim chat", allClaims);

  /**
   * Transform real claims data into distribution by type/category
   */
  const transformClaimsByType = () => {
    // Return sample data if no real data provided
    if (!claimsData?.claims || !Array.isArray(claimsData.claims)) {
      return [
        { name: "Home Damage", value: 35, color: "#f97316" },
        { name: "Auto Collision", value: 28, color: "#8b5cf6" },
        { name: "Theft", value: 18, color: "#64748b" },
        { name: "Fire", value: 12, color: "#dc2626" },
        { name: "Water Damage", value: 7, color: "#0ea5e9" },
      ];
    }

    // Initialize counters for claim types
    const typeCounts: Record<string, number> = {};

    // Count claims by type/category
    claimsData.claims.forEach((claim: any) => {
      const type = claim.type || claim.category || claim.claimType || "Other";
      const normalizedType = normalizeType(type);

      typeCounts[normalizedType] = (typeCounts[normalizedType] || 0) + 1;
    });

    // Calculate total for percentages
    const totalClaims = Object.values(typeCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    // Convert to percentage and format
    const result = Object.entries(typeCounts)
      .map(([type, count]) => {
        const percentage = Math.round((count / totalClaims) * 100);
        return {
          name: type,
          value: percentage,
          count: count,
          color: getTypeColor(type),
        };
      })
      .sort((a, b) => b.value - a.value) // Sort by percentage descending
      .slice(0, 8); // Limit to top 8 types for readability

    return result;
  };

  /**
   * Normalize different status formats to standard ones
   */
  const normalizeStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      APPROVED: "Approved",
      // APPROVE: "Approved",
      // PAID: "Paid",
      // COMPLETED: "Approved",
      PENDING: "Pending",
      // IN_REVIEW: "Under Review",
      UNDER_REVIEW: "Under Review",
      // REVIEW: "Under Review",
      REJECTED: "Rejected",
      // DENIED: "Rejected",
      // DECLINED: "Rejected",
      // PROCESSING: "Processing",
      // IN_PROGRESS: "Processing",
    };

    const upperStatus = status.toUpperCase();
    return (
      statusMap[upperStatus] ||
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    );
  };

  /**
   * Normalize different type formats
   */
  const normalizeType = (type: string): string => {
    const typeMap: Record<string, string> = {
      HOME: "Home Damage",
      AUTO: "Auto Collision",
      VEHICLE: "Auto Collision",
      CAR: "Auto Collision",
      THEFT: "Theft",
      BURGLARY: "Theft",
      FIRE: "Fire",
      WATER: "Water Damage",
      FLOOD: "Water Damage",
      HEALTH: "Medical",
      MEDICAL: "Medical",
      LIABILITY: "Liability",
      PROPERTY: "Property Damage",
    };

    const upperType = type.toUpperCase();
    return (
      typeMap[upperType] ||
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    );
  };

  /**
   * Get color based on status
   */
  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      Approved: "#10b981", // Green
      Paid: "#10b981", // Green
      Pending: "#f59e0b", // Yellow/Orange
      "Under Review": "#3b82f6", // Blue
      Processing: "#3b82f6", // Blue
      Rejected: "#ef4444", // Red
      Denied: "#ef4444", // Red
    };
    return colorMap[status] || "#64748b"; // Default gray
  };

  /**
   * Get color based on claim type
   */
  const getTypeColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      "Home Damage": "#f97316", // Orange
      "Auto Collision": "#8b5cf6", // Purple
      Theft: "#64748b", // Slate
      Fire: "#dc2626", // Red
      "Water Damage": "#0ea5e9", // Sky blue
      Medical: "#ec4899", // Pink
      Liability: "#84cc16", // Lime
      "Property Damage": "#f59e0b", // Amber
    };

    // If type not in map, generate consistent color based on string hash
    if (!colorMap[type]) {
      const colors = [
        "#f97316",
        "#8b5cf6",
        "#64748b",
        "#dc2626",
        "#0ea5e9",
        "#ec4899",
        "#84cc16",
        "#f59e0b",
        "#10b981",
        "#3b82f6",
        "#ef4444",
        "#14b8a6",
      ];
      const hash = type
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return colors[hash % colors.length];
    }

    return colorMap[type];
  };

  /**
   * Transform payment data to get claims paid amounts (if you need to show amounts instead of counts)
   */
  // const transformClaimsPaidData = () => {
  //   if (!paymentData?.paid || !Array.isArray(paymentData.paid)) {
  //     return null;
  //   }

  //   // Filter payments that are for claims (you might need to adjust this logic)
  //   const claimPayments = paymentData.paid.filter(
  //     (payment: any) =>
  //       payment.type === "claim" ||
  //       payment.description?.includes("claim") ||
  //       payment.claimId
  //   );

  //   // Group by status or type based on what you want to show
  //   // This is optional and depends on your data structure
  //   return claimPayments;
  // };

  // Get the transformed data
  const claimsByStatus = transformClaimsByStatus();
  const claimsByType = transformClaimsByType();

  // Optional: Get total claims count for display
  const totalClaimsCount =
    claimsData?.claims?.length ||
    claimsByStatus.reduce((sum, item: any) => sum + (item.count || 0), 0);

  return (
    <div className="h-80">
      {/* Optional: Display total claims count */}
      {claimsData && (
        <div className="text-center text-sm text-gray-600 mb-2">
          Total Claims: {totalClaimsCount}
        </div>
      )}

      <ResponsiveContainer width="100%" height="100%">
        {detailed ? (
          // Detailed view: Two concentric pie charts
          <PieChart>
            {/* Inner ring: Claims by Type */}
            <Pie
              data={claimsByType}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={(entry) => `${entry.name}: ${entry.value}%`}
            >
              {claimsByType.map((entry: any, index) => (
                <Cell key={`type-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            {/* Outer ring: Claims by Status */}
            <Pie
              data={claimsByStatus}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={(entry) => `${entry.name}: ${entry.value}%`}
            >
              {claimsByStatus.map((entry: any, index) => (
                <Cell key={`status-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: any, name: any, props: any) => {
                const payload = props.payload;
                return [
                  `${value}% (${payload.count || 0} claims)`,
                  payload.name,
                ];
              }}
            />
            <Legend />
          </PieChart>
        ) : (
          // Simple view: Only claims by status
          <PieChart>
            <Pie
              data={claimsByStatus}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={(entry: any) => `${entry.name}: ${entry.value}%`}
            >
              {claimsByStatus.map((entry: any, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any, props: any) => {
                const payload = props.payload;
                return [
                  `${value}% (${payload.count || 0} claims)`,
                  payload.name,
                ];
              }}
            />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ClaimsDistributionChart;
