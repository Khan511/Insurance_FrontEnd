import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetAllCustomersQuery } from "@/services/AdminSlice";

type AnalyticsPeriod = "7d" | "30d" | "90d" | "1y" | "all";

interface CustomerData {
  customerId: string;
  email: string;
  joinDate: string;
  numberOfPolicies: number;
  premium: string;
  currency: string;
  status: string;

  customerDateOfBirth: string;
  customerFirstname: string;
  customerLastname: string;
  customerActivePolicies: number;
  customerPhone: string;
  customerAlternativePhone: string;

  customerIdType: string;
  customerIdMaskedNumber: string;
  idIssuingCountry: string;
  idExpirationDate: string;
  idVerificationStatus: string;

  customerPrimaryAddressStreet: string;
  customerPrimaryAddressCity: string;
  customerPrimaryAddressPostalCode: string;
  customerPrimaryAddressCountry: string;

  customerBillingAddressStreet: string;
  customerBillingAddressCity: string;
  customerBillingAddressPostalCode: string;
  customerBillingAddressCountry: string;
}

interface CustomerGrowthChartProps {
  // detailed?: boolean;
  period?: AnalyticsPeriod;
  customersData?: any[];
}

const CustomerGrowthChart = ({
  // detailed = true,
  period = "30d",
  customersData: externalCustomerData,
}: CustomerGrowthChartProps) => {
  const {
    data: internalCustomerData,
    isLoading,
    isError,
    error,
  } = useGetAllCustomersQuery(undefined, {
    skip: !!externalCustomerData,
  });

  // Extract customers array from the response
  const customers = externalCustomerData
    ? externalCustomerData
    : internalCustomerData || [];

  console.log("Customer data in chart:", customers);

  const transformCustomerData = () => {
    // Get the date range based on period
    const { startDate, endDate } = getDateRangeForPeriod(period);

    // Filter customers by joinDate within the period
    const filteredCustomers = customers.filter((customer: CustomerData) => {
      if (!customer.joinDate) return false;

      const joinDate = new Date(customer.joinDate);
      return joinDate >= startDate && joinDate <= endDate;
    });

    // Sort customers by joinDate ascending
    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
      const dateA = new Date(a.joinDate);
      const dateB = new Date(b.joinDate);
      return dateA.getTime() - dateB.getTime();
    });

    // Initialize data structure for months
    const monthsData = initializeMonthsData(startDate, endDate);

    // Count new customers by month
    sortedCustomers.forEach((customer: CustomerData) => {
      const joinDate = new Date(customer.joinDate);
      const monthKey = joinDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (monthsData[monthKey]) {
        monthsData[monthKey].newCustomers++;
      }
    });

    // Calculate cumulative totals
    let cumulativeTotal = 0;
    const chartData = Object.entries(monthsData)
      .map(([month, data]) => {
        cumulativeTotal += data.newCustomers;
        return {
          month,
          newCustomers: data.newCustomers,
          total: cumulativeTotal,
          date: data.date, // For sorting
        };
      })
      // Sort by date
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((item) => ({
        month: item.month,
        newCustomers: item.newCustomers,
        total: item.total,
      }));

    return chartData;
  };

  /**
   * Get date range based on selected period
   */
  const getDateRangeForPeriod = (period: string) => {
    const endDate = new Date();
    let startDate = new Date();

    switch (period.toLowerCase()) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
      case "1m":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "90d":
      case "3m":
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "6m":
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "1y":
      default:
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case "2y":
        startDate.setFullYear(endDate.getFullYear() - 2);
        break;
      case "all":
        // Find the earliest join date among customers
        if (customers && customers.length > 0) {
          const earliestDate = customers.reduce(
            (earliest: Date, customer: CustomerData) => {
              const joinDate = new Date(customer.joinDate);
              return joinDate < earliest ? joinDate : earliest;
            },
            new Date()
          ); // Start with current date
          startDate = earliestDate;
        } else {
          startDate.setFullYear(endDate.getFullYear() - 1); // Default to 1 year
        }
        break;
    }

    return { startDate, endDate };
  };

  /**
   * Initialize months data object with zero values
   */
  const initializeMonthsData = (startDate: Date, endDate: Date) => {
    const monthsData: Record<string, { newCustomers: number; date: Date }> = {};
    let currentDate = new Date(startDate);

    // Ensure we start from the first day of the month
    currentDate.setDate(1);

    // Generate all months between start and end date
    while (currentDate <= endDate) {
      const monthKey = currentDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      monthsData[monthKey] = {
        newCustomers: 0,
        date: new Date(currentDate), // Store copy for sorting
      };
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return monthsData;
  };

  /**
   * Calculate growth metrics
   */
  /**
   * Calculate growth metrics - FIXED VERSION
   */
  const calculateGrowthMetrics = () => {
    if (isLoading || isError || !customers || !Array.isArray(customers)) {
      return {
        totalCustomers: 0,
        growthRate: 0,
        newThisMonth: 0,
        activeCustomers: 0,
      };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Get the start and end of current month
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const nextMonthStart = new Date(currentYear, currentMonth + 1, 1);

    console.log("=== DEBUG: Date Ranges ===");
    console.log("Current month start:", currentMonthStart);
    console.log("Current month end:", nextMonthStart);
    console.log(
      "Current month name:",
      currentMonthStart.toLocaleString("en-US", { month: "long" })
    );

    // Calculate new customers this month
    const newThisMonth = customers.filter((customer: CustomerData) => {
      if (!customer.joinDate) return false;

      const joinDate = new Date(customer.joinDate);

      // Check if joinDate is within the current month
      return joinDate >= currentMonthStart && joinDate < nextMonthStart;
    }).length;

    console.log("New customers this month:", newThisMonth);

    // Calculate growth rate (percentage increase from previous month)
    const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const previousMonthEnd = new Date(currentYear, currentMonth, 1);

    const newPreviousMonth = customers.filter((customer: CustomerData) => {
      if (!customer.joinDate) return false;
      const joinDate = new Date(customer.joinDate);
      return joinDate >= previousMonthStart && joinDate < previousMonthEnd;
    }).length;

    console.log("New customers previous month:", newPreviousMonth);

    const growthRate =
      newPreviousMonth > 0
        ? ((newThisMonth - newPreviousMonth) / newPreviousMonth) * 100
        : newThisMonth > 0
        ? 100
        : 0;

    // Estimate active customers
    const activeCustomers = customers.filter((customer) => {
      return customer.status && customer.status.toLowerCase() === "active";
    }).length;

    const inactiveCustomers = customers.filter((customer) => {
      return customer.status && customer.status.toLowerCase() === "inactive";
    }).length;

    return {
      totalCustomers: customers.length,
      growthRate: Math.round(growthRate * 10) / 10,
      newThisMonth,
      activeCustomers,
      inactiveCustomers,
    };
  };

  // Get transformed data
  const growthData = transformCustomerData();

  // Calculate metrics
  const metrics = calculateGrowthMetrics();

  // Loading state
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl">⚠️</div>
          <p className="mt-2 text-gray-600">Error loading customer data</p>
          <p className="text-sm text-gray-500">Using sample data instead</p>
          {error && (
            <p className="text-xs text-gray-400 mt-2">
              Error: {error.toString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Growth Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Total Customers</div>
          <div className="text-2xl font-semibold text-purple-600">
            {metrics.totalCustomers}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Growth Rate</div>
          <div
            className={`text-2xl font-semibold ${
              metrics.growthRate > 0
                ? "text-green-600"
                : metrics.growthRate < 0
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {metrics.growthRate > 0 ? "+" : ""}
            {metrics.growthRate}%
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">New This Month</div>
          <div className="text-2xl font-semibold text-blue-600">
            {metrics.newThisMonth}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Active (12 months)</div>
          <div className="text-2xl font-semibold text-amber-600">
            {metrics.activeCustomers}
          </div>
        </div>
      </div>

      {/* Data Info */}
      {customers && customers.length > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          <p>
            Showing customer growth data based on {customers.length} customer
            {customers.length !== 1 ? "s" : ""}
          </p>
          {period && (
            <p className="text-xs text-gray-500">
              Period: {period === "1y" ? "Last 12 months" : period}
              {period === "all" && " (All available data)"}
            </p>
          )}
          {customers.length > 0 && (
            <p className="text-xs text-gray-500">
              Earliest join date:{" "}
              {new Date(customers[0].joinDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={growthData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              stroke="#888888"
              fontSize={12}
              tick={{ fill: "#555" }}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              label={{
                value: "Customers",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { textAnchor: "middle", fill: "#666" },
              }}
            />
            <Tooltip
              formatter={(value: any, name: string) => {
                if (name === "New Customers" || name === "Total Customers") {
                  return [`${value} `, name];
                }
                return [value, name];
              }}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />

            <>
              <Area
                type="monotone"
                dataKey="total"
                name="Total Customers"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="newCustomers"
                name="New Customers"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with real data stats */}
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
            <span>Total Customers: {metrics.totalCustomers}</span>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
            <span>Active Customers: {metrics.activeCustomers}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
            <span>Inactive Customers: {metrics.inactiveCustomers}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerGrowthChart;
