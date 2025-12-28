// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import {
//   Users,
//   DollarSign,
//   Shield,
//   AlertTriangle,
//   Clock,
//   BarChart3,
//   LineChart,
//   Calendar,
//   CheckCircle,
// } from "lucide-react";
// import { useGetAllPoliciesQuery, type Payment } from "@/services/AdminSlice";
// import { useGetAllClaimsQuery } from "@/services/AdminSlice";
// import { useGetAllCustomersQuery } from "@/services/AdminSlice";
// import { useGetAllPaymentsQuery } from "@/services/AdminSlice";
// import { subMonths } from "date-fns";
// import RevenueChart from "./analytics/RevenueChartProps";
// import PolicyMetricsChart from "./analytics/PolicyMetricsChart";
// import CustomerGrowthChart from "./analytics/CustomerGrowthChart";
// import PaymentMetricsChart from "./analytics/PaymentMetricsChart";
// import type { ClaimApiResponse } from "../claim/Types";
// import ClaimsDistributionChart from "./analytics/ClaimsDistributionChart";

// type AnalyticsPeriod = "7d" | "30d" | "90d" | "1y" | "all";

// interface AnalyticsData {
//   totalRevenue: number;
//   revenueChange: number;
//   activePolicies: number;
//   policiesChange: number;
//   pendingClaims: number;
//   claimsChange: number;
//   totalCustomers: number;
//   customersChange: number;
//   claimApprovalRate: number;
//   avgProcessingTime: number;
//   customerSatisfaction: number;
//   upcomingPayments: number;
//   overduePayments: number;
//   totalPaidPayments: number;
//   totalUpcomingPayments: number;
//   totalOverduePayments: number;
// }

// type PaymentData = {
//   coming: Payment[];
//   overdue: Payment[];
//   paid: Payment[];
// };

// // StatsCard Component - similar to your example
// const StatsCard = ({
//   title,
//   value,
//   description,
//   icon,
//   color,
// }: {
//   title: string;
//   value: string;
//   description: string;
//   icon: React.ReactNode;
//   color: "blue" | "green" | "yellow" | "emerald" | "orange" | "purple";
// }) => {
//   const colorClasses = {
//     blue: "bg-blue-50 border-blue-200 text-blue-800",
//     green: "bg-green-50 border-green-200 text-green-800",
//     yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
//     emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
//     orange: "bg-orange-50 border-orange-200 text-orange-800",
//     purple: "bg-purple-50 border-purple-200 text-purple-800",
//   };

//   const iconBgClasses = {
//     blue: "bg-blue-100",
//     green: "bg-green-100",
//     yellow: "bg-yellow-100",
//     emerald: "bg-emerald-100",
//     orange: "bg-orange-100",
//     purple: "bg-purple-100",
//   };

//   const iconColorClasses = {
//     blue: "text-blue-600",
//     green: "text-green-600",
//     yellow: "text-yellow-600",
//     emerald: "text-emerald-600",
//     orange: "text-orange-600",
//     purple: "text-purple-600",
//   };

//   return (
//     <Card className={`border ${colorClasses[color]}`}>
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-medium">{title}</p>
//             <p className="text-2xl font-bold">{value}</p>
//             <p className="text-xs opacity-75">{description}</p>
//           </div>
//           <div className={`p-1 rounded-full ${iconBgClasses[color]}`}>
//             <div className={iconColorClasses[color]}>{icon}</div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const AdminAnalytics = () => {
//   const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
//   const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
//     totalRevenue: 0,
//     revenueChange: 0,
//     activePolicies: 0,
//     policiesChange: 0,
//     pendingClaims: 0,
//     claimsChange: 0,
//     totalCustomers: 0,
//     customersChange: 0,
//     claimApprovalRate: 0,
//     avgProcessingTime: 0,
//     customerSatisfaction: 0,
//     upcomingPayments: 0,
//     overduePayments: 0,
//     totalPaidPayments: 0,
//     totalUpcomingPayments: 0,
//     totalOverduePayments: 0,
//   });

//   // Fetch data from APIs
//   const { data: policiesData, isLoading: policiesLoading } =
//     useGetAllPoliciesQuery();
//   const { data: claimsData, isLoading: claimsLoading } = useGetAllClaimsQuery({
//     sortBy: "submissiondate",
//     sortDirection: "DESC",
//   });
//   const { data: customersData, isLoading: customersLoading } =
//     useGetAllCustomersQuery();
//   const { data: paymentsData, isLoading: paymentsLoading } =
//     useGetAllPaymentsQuery();

//   // Combined loading state
//   const isLoading =
//     policiesLoading || claimsLoading || customersLoading || paymentsLoading;

//   useEffect(() => {
//     if (policiesData && claimsData && customersData && paymentsData) {
//       calculateAnalytics();
//     }
//   }, [policiesData, claimsData, customersData, paymentsData, period]);

//   const calculateAnalytics = () => {
//     // Calculate metrics based on data and period
//     const policies = policiesData || [];
//     const claims = (claimsData as unknown as ClaimApiResponse[]) || [];
//     const customers = customersData || [];
//     const payments = paymentsData as unknown as PaymentData;

//     // Filter data based on selected period
//     const now = new Date();
//     let startDate: Date;

//     switch (period) {
//       case "7d":
//         startDate = new Date(now.setDate(now.getDate() - 7));
//         break;
//       case "30d":
//         startDate = subMonths(now, 1);
//         break;
//       case "90d":
//         startDate = subMonths(now, 3);
//         break;
//       case "1y":
//         startDate = subMonths(now, 12);
//         break;
//       default:
//         startDate = new Date(0); // Beginning of time
//     }

//     // Calculate metrics
//     const activePolicies = policies.filter((p) => p.status === "ACTIVE").length;
//     // const totalPolicies = policies.length;

//     const pendingClaims = claims?.filter(
//       (c) => c.status === "PENDING" || c.status === "UNDER_REVIEW"
//     ).length;

//     const approvedClaims = claims.filter((c) => c.status === "APPROVED").length;
//     const totalClaims = claims.length;

//     const claimApprovalRate =
//       totalClaims > 0 ? (approvedClaims / totalClaims) * 100 : 0;

//     // Calculate total revenue from paid payments
//     const totalRevenue = payments.paid.reduce((sum: number, payment: any) => {
//       const amount =
//         payment.dueAmount?.amount || payment.amount || payment.dueAmount || 0;
//       return sum + Number(amount);
//     }, 0);

//     const totalCustomers = customers.length;

//     // Get next pending payments
//     const getNextPendingPayments = (): Payment[] => {
//       if (!policiesData) return [];

//       return policiesData
//         .map((policy) => {
//           const nextPayment = policy.paymentSchedules
//             ?.filter((schedule) => schedule.status === "PENDING")
//             .sort(
//               (a, b) =>
//                 new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
//             )[0];

//           if (!nextPayment) return null;

//           return {
//             id: nextPayment.id,
//             customer: policy.policyHolderName || "Unknown",
//             policyNumber: policy.policyNumber || policy.id?.toString() || "N/A",
//             dueAmount: {
//               amount: nextPayment.dueAmount,
//               currency: nextPayment.currency,
//             },
//             currency: nextPayment.currency,
//             dueDate: nextPayment.dueDate,
//             paidDate: nextPayment.paidDate,
//             status: nextPayment.status,
//           };
//         })
//         .filter(Boolean) as unknown as Payment[];
//     };

//     const nextpendingPayment = getNextPendingPayments();

//     // Calculate upcoming payments
//     const upcomingPayments = nextpendingPayment.reduce(
//       (sum: number, payment: any) => {
//         const amount =
//           payment.dueAmount?.amount || payment.amount || payment.dueAmount || 0;
//         return sum + Number(amount);
//       },
//       0
//     );

//     // Calculate overdue payments
//     const overduePayments = payments.overdue.reduce(
//       (sum: number, payment: any) => {
//         const amount =
//           payment.dueAmount?.amount || payment.amount || payment.dueAmount || 0;
//         return sum + Number(amount);
//       },
//       0
//     );

//     // Calculate changes (simplified)
//     const revenueChange = 12.5;
//     const policiesChange = 8.2;
//     const claimsChange = -3.1;
//     const customersChange = 15.7;

//     // Add payment insights to state if needed
//     setAnalyticsData({
//       totalRevenue,
//       revenueChange,
//       activePolicies,
//       policiesChange,
//       pendingClaims,
//       claimsChange,
//       totalCustomers,
//       customersChange,
//       claimApprovalRate,
//       avgProcessingTime: 2.3,
//       customerSatisfaction: 94.2,
//       upcomingPayments,
//       overduePayments,
//       totalPaidPayments: payments.paid.length,
//       totalUpcomingPayments: payments.coming.length,
//       totalOverduePayments: payments.overdue.length,
//     });
//   };

//   // Format currency for display
//   const formatCurrency = (amount: number, currency: string = "DKK") => {
//     try {
//       return new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: currency,
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 2,
//       }).format(amount);
//     } catch (error) {
//       return `${currency} ${amount.toLocaleString()}`;
//     }
//   };

//   // Format number with commas
//   const formatNumber = (num: number) => {
//     return num.toLocaleString();
//   };

//   // Get currency from payment data
//   const currency = "DKK";

//   // QuickStats with StatsCard
//   const QuickStats = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
//       <StatsCard
//         title="Total Revenue"
//         value={formatCurrency(analyticsData.totalRevenue, currency)}
//         description="Total collected revenue"
//         icon={<DollarSign className="h-5 w-5" />}
//         color="emerald"
//       />
//       <StatsCard
//         title="Upcoming Payments"
//         value={formatCurrency(analyticsData.upcomingPayments, currency)}
//         description="Next month's payments"
//         icon={<Clock className="h-5 w-5" />}
//         color="orange"
//       />
//       <StatsCard
//         title="Active Policies"
//         value={formatNumber(analyticsData.activePolicies)}
//         description={`${
//           analyticsData.activePolicies > 0 && analyticsData.activePolicies > 0
//             ? Math.round(
//                 (analyticsData.activePolicies / analyticsData.activePolicies) *
//                   100
//               )
//             : 0
//         }% active rate`}
//         icon={<CheckCircle className="h-5 w-5" />}
//         color="green"
//       />
//       <StatsCard
//         title="Pending Claims"
//         value={formatNumber(analyticsData.pendingClaims)}
//         description="Needs review"
//         icon={<AlertTriangle className="h-5 w-5" />}
//         color="yellow"
//       />
//       <StatsCard
//         title="Total Customers"
//         value={formatNumber(analyticsData.totalCustomers)}
//         description="Registered customers"
//         icon={<Users className="h-5 w-5" />}
//         color="purple"
//       />
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
//           <p className="text-muted-foreground">
//             Overview of your insurance platform performance
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2">
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//             <select
//               value={period}
//               onChange={(e) => setPeriod(e.target.value as AnalyticsPeriod)}
//               className="bg-background border rounded-md px-3 py-2 text-sm"
//             >
//               <option value="7d">Last 7 days</option>
//               <option value="30d">Last 30 days</option>
//               <option value="90d">Last 90 days</option>
//               <option value="1y">Last year</option>
//               <option value="all">All time</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <QuickStats />

//       {/* Charts Section */}
//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="overview" className="flex items-center gap-2">
//             <BarChart3 className="h-4 w-4" />
//             Overview
//           </TabsTrigger>
//           <TabsTrigger value="revenue" className="flex items-center gap-2">
//             <LineChart className="h-4 w-4" />
//             Revenue
//           </TabsTrigger>
//           <TabsTrigger value="payments" className="flex items-center gap-2">
//             <DollarSign className="h-4 w-4" />
//             Payments
//           </TabsTrigger>
//           <TabsTrigger value="claims" className="flex items-center gap-2">
//             <Shield className="h-4 w-4" />
//             Claims
//           </TabsTrigger>
//           <TabsTrigger value="customers" className="flex items-center gap-2">
//             <Users className="h-4 w-4" />
//             Customers
//           </TabsTrigger>
//         </TabsList>

//         {/* Overview Tab */}
//         <TabsContent value="overview" className="space-y-4">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Revenue Trends</CardTitle>
//                 <CardDescription>Monthly revenue over time</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <RevenueChart
//                   period={period}
//                   paymentData={paymentsData}
//                   claimsData={claimsData}
//                 />
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Claims Distribution</CardTitle>
//                 <CardDescription>Claims by status and type</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ClaimsDistributionChart
//                   period={period}
//                   claimsData={claimsData as any}
//                 />
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Policy Metrics</CardTitle>
//                 <CardDescription>Active vs Inactive policies</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <PolicyMetricsChart period={period} />
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Customer Growth</CardTitle>
//                 <CardDescription>New customer acquisition</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <CustomerGrowthChart period={period} />
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Revenue Tab */}
//         <TabsContent value="revenue">
//           <Card>
//             <CardHeader>
//               <CardTitle>Detailed Revenue Analysis</CardTitle>
//               <CardDescription>
//                 Revenue breakdown by product and time period
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <RevenueChart
//                 detailed
//                 period={period}
//                 paymentData={paymentsData}
//                 claimsData={claimsData}
//               />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Payments Tab */}
//         <TabsContent value="payments">
//           <Card>
//             <CardHeader>
//               <CardTitle>Payment Metrics</CardTitle>
//               <CardDescription>Payment status and amounts</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <PaymentMetricsChart
//                 paymentsData={paymentsData as unknown as PaymentData}
//               />
//               <div className="grid grid-cols-3 gap-4 mt-6">
//                 <Card>
//                   <CardContent className="p-4 text-center">
//                     <div className="text-2xl font-bold text-green-600">
//                       {analyticsData.totalPaidPayments}
//                     </div>
//                     <p className="text-sm text-gray-600">Paid Payments</p>
//                     <p className="text-xs text-gray-500">
//                       {formatCurrency(analyticsData.totalRevenue, currency)}
//                     </p>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardContent className="p-4 text-center">
//                     <div className="text-2xl font-bold text-blue-600">
//                       {analyticsData.totalUpcomingPayments}
//                     </div>
//                     <p className="text-sm text-gray-600">Upcoming Payments</p>
//                     <p className="text-xs text-gray-500">
//                       {formatCurrency(analyticsData.upcomingPayments, currency)}
//                     </p>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardContent className="p-4 text-center">
//                     <div className="text-2xl font-bold text-red-600">
//                       {analyticsData.totalOverduePayments}
//                     </div>
//                     <p className="text-sm text-gray-600">Overdue Payments</p>
//                     <p className="text-xs text-gray-500">
//                       {formatCurrency(analyticsData.overduePayments, currency)}
//                     </p>
//                   </CardContent>
//                 </Card>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Claims Tab */}
//         <TabsContent value="claims">
//           <Card>
//             <CardHeader>
//               <CardTitle>Claims Analytics</CardTitle>
//               <CardDescription>
//                 Detailed claims processing metrics
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ClaimsDistributionChart detailed period={period} />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Customers Tab */}
//         <TabsContent value="customers">
//           <Card>
//             <CardHeader>
//               <CardTitle>Customer Analytics</CardTitle>
//               <CardDescription>
//                 Customer acquisition and retention metrics
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <CustomerGrowthChart period={period} />
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default AdminAnalytics;

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  DollarSign,
  Shield,
  AlertTriangle,
  Clock,
  BarChart3,
  LineChart,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useGetAllPoliciesQuery, type Payment } from "@/services/AdminSlice";
import { useGetAllClaimsQuery } from "@/services/AdminSlice";
import { useGetAllCustomersQuery } from "@/services/AdminSlice";
import { useGetAllPaymentsQuery } from "@/services/AdminSlice";
import { subMonths } from "date-fns";
import RevenueChart from "./analytics/RevenueChartProps";
import PolicyMetricsChart from "./analytics/PolicyMetricsChart";
import CustomerGrowthChart from "./analytics/CustomerGrowthChart";
import PaymentMetricsChart from "./analytics/PaymentMetricsChart";
import type { ClaimApiResponse } from "../claim/Types";
import ClaimsDistributionChart from "./analytics/ClaimsDistributionChart";

type AnalyticsPeriod = "7d" | "30d" | "90d" | "1y" | "all";

interface AnalyticsData {
  totalRevenue: number;
  revenueChange: number;
  activePolicies: number;
  policiesChange: number;
  pendingClaims: number;
  claimsChange: number;
  totalCustomers: number;
  customersChange: number;
  claimApprovalRate: number;
  avgProcessingTime: number;
  customerSatisfaction: number;
  upcomingPayments: number;
  overduePayments: number;
  totalPaidPayments: number;
  totalUpcomingPayments: number;
  totalOverduePayments: number;
}

type PaymentData = {
  coming: Payment[];
  overdue: Payment[];
  paid: Payment[];
};

// StatsCard Component
const StatsCard = ({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "emerald" | "orange" | "purple";
}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
  };

  const iconBgClasses = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    yellow: "bg-yellow-100",
    emerald: "bg-emerald-100",
    orange: "bg-orange-100",
    purple: "bg-purple-100",
  };

  const iconColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    emerald: "text-emerald-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  };

  return (
    <Card className={`border ${colorClasses[color]}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs opacity-75">{description}</p>
          </div>
          <div className={`p-1 rounded-full ${iconBgClasses[color]}`}>
            <div className={iconColorClasses[color]}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminAnalytics = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 0,
    revenueChange: 0,
    activePolicies: 0,
    policiesChange: 0,
    pendingClaims: 0,
    claimsChange: 0,
    totalCustomers: 0,
    customersChange: 0,
    claimApprovalRate: 0,
    avgProcessingTime: 0,
    customerSatisfaction: 0,
    upcomingPayments: 0,
    overduePayments: 0,
    totalPaidPayments: 0,
    totalUpcomingPayments: 0,
    totalOverduePayments: 0,
  });

  // Fetch all data in parent component
  const { data: policiesData, isLoading: policiesLoading } =
    useGetAllPoliciesQuery();
  const { data: claimsData, isLoading: claimsLoading } = useGetAllClaimsQuery({
    sortBy: "submissiondate",
    sortDirection: "DESC",
  });
  const { data: customersData, isLoading: customersLoading } =
    useGetAllCustomersQuery();
  const { data: paymentsData, isLoading: paymentsLoading } =
    useGetAllPaymentsQuery();

  // Combined loading state
  const isLoading =
    policiesLoading || claimsLoading || customersLoading || paymentsLoading;

  useEffect(() => {
    if (policiesData && claimsData && customersData && paymentsData) {
      calculateAnalytics();
    }
  }, [policiesData, claimsData, customersData, paymentsData, period]);

  const calculateAnalytics = () => {
    const policies = policiesData || [];
    const claims = (claimsData as unknown as ClaimApiResponse[]) || [];
    const customers = customersData || [];
    const payments = paymentsData as unknown as PaymentData;

    // Filter data based on selected period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "7d":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "30d":
        startDate = subMonths(now, 1);
        break;
      case "90d":
        startDate = subMonths(now, 3);
        break;
      case "1y":
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = new Date(0);
    }

    // Calculate metrics
    const activePolicies = policies.filter((p) => p.status === "ACTIVE").length;
    const pendingClaims = claims?.filter(
      (c) => c.status === "PENDING" || c.status === "UNDER_REVIEW"
    ).length;
    const approvedClaims = claims.filter((c) => c.status === "APPROVED").length;
    const totalClaims = claims.length;
    const claimApprovalRate =
      totalClaims > 0 ? (approvedClaims / totalClaims) * 100 : 0;

    const totalRevenue = payments.paid.reduce((sum: number, payment: any) => {
      const amount =
        payment.dueAmount?.amount || payment.amount || payment.dueAmount || 0;
      return sum + Number(amount);
    }, 0);

    const totalCustomers = customers.length;

    const getNextPendingPayments = (): Payment[] => {
      if (!policiesData) return [];

      return policiesData
        .map((policy) => {
          const nextPayment = policy.paymentSchedules
            ?.filter((schedule) => schedule.status === "PENDING")
            .sort(
              (a, b) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            )[0];

          if (!nextPayment) return null;

          return {
            id: nextPayment.id,
            customer: policy.policyHolderName || "Unknown",
            policyNumber: policy.policyNumber || policy.id?.toString() || "N/A",
            dueAmount: {
              amount: nextPayment.dueAmount,
              currency: nextPayment.currency,
            },
            currency: nextPayment.currency,
            dueDate: nextPayment.dueDate,
            paidDate: nextPayment.paidDate,
            status: nextPayment.status,
          };
        })
        .filter(Boolean) as unknown as Payment[];
    };

    const nextpendingPayment = getNextPendingPayments();
    const upcomingPayments = nextpendingPayment.reduce(
      (sum: number, payment: any) => {
        const amount =
          payment.dueAmount?.amount || payment.amount || payment.dueAmount || 0;
        return sum + Number(amount);
      },
      0
    );

    const overduePayments = payments.overdue.reduce(
      (sum: number, payment: any) => {
        const amount =
          payment.dueAmount?.amount || payment.amount || payment.dueAmount || 0;
        return sum + Number(amount);
      },
      0
    );

    // Simplified changes (you can enhance these)
    const revenueChange = 12.5;
    const policiesChange = 8.2;
    const claimsChange = -3.1;
    const customersChange = 15.7;

    setAnalyticsData({
      totalRevenue,
      revenueChange,
      activePolicies,
      policiesChange,
      pendingClaims,
      claimsChange,
      totalCustomers,
      customersChange,
      claimApprovalRate,
      avgProcessingTime: 2.3,
      customerSatisfaction: 94.2,
      upcomingPayments,
      overduePayments,
      totalPaidPayments: payments.paid.length,
      totalUpcomingPayments: payments.coming.length,
      totalOverduePayments: payments.overdue.length,
    });
  };

  // Format functions
  const formatCurrency = (amount: number, currency: string = "DKK") => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      return `${currency} ${amount.toLocaleString()}`;
    }
  };

  const formatNumber = (num: number) => num.toLocaleString();
  const currency = "DKK";

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // QuickStats Component
  const QuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(analyticsData.totalRevenue, currency)}
        description="Total collected revenue"
        icon={<DollarSign className="h-5 w-5" />}
        color="emerald"
      />
      <StatsCard
        title="Upcoming Payments"
        value={formatCurrency(analyticsData.upcomingPayments, currency)}
        description="Next month's payments"
        icon={<Clock className="h-5 w-5" />}
        color="orange"
      />
      <StatsCard
        title="Active Policies"
        value={formatNumber(analyticsData.activePolicies)}
        description={`${
          analyticsData.activePolicies > 0
            ? Math.round(
                (analyticsData.activePolicies / (policiesData?.length || 1)) *
                  100
              )
            : 0
        }% active rate`}
        icon={<CheckCircle className="h-5 w-5" />}
        color="green"
      />
      <StatsCard
        title="Pending Claims"
        value={formatNumber(analyticsData.pendingClaims)}
        description="Needs review"
        icon={<AlertTriangle className="h-5 w-5" />}
        color="yellow"
      />
      <StatsCard
        title="Total Customers"
        value={formatNumber(analyticsData.totalCustomers)}
        description="Registered customers"
        icon={<Users className="h-5 w-5" />}
        color="purple"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your insurance platform performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as AnalyticsPeriod)}
              className="bg-background border rounded-md px-3 py-2 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Stats - Now shows actual data */}
      <QuickStats />

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="claims" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Claims
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customers
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Pass data to all components */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart
                  period={period}
                  paymentData={paymentsData}
                  claimsData={claimsData}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Claims Distribution</CardTitle>
                <CardDescription>Claims by status and type</CardDescription>
              </CardHeader>
              <CardContent>
                <ClaimsDistributionChart
                  period={period}
                  claimsData={claimsData as any}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Policy Metrics</CardTitle>
                <CardDescription>Active vs Inactive policies</CardDescription>
              </CardHeader>
              <CardContent>
                <PolicyMetricsChart
                  period={period}
                  policiesData={policiesData as any}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New customer acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerGrowthChart
                  period={period}
                  customersData={customersData as any}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Revenue Analysis</CardTitle>
              <CardDescription>
                Revenue breakdown by product and time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart
                detailed
                period={period}
                paymentData={paymentsData}
                claimsData={claimsData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Metrics</CardTitle>
              <CardDescription>Payment status and amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMetricsChart
                paymentsData={paymentsData as unknown as PaymentData}
              />
              <div className="grid grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analyticsData.totalPaidPayments}
                    </div>
                    <p className="text-sm text-gray-600">Paid Payments</p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(analyticsData.totalRevenue, currency)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analyticsData.totalUpcomingPayments}
                    </div>
                    <p className="text-sm text-gray-600">Upcoming Payments</p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(analyticsData.upcomingPayments, currency)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {analyticsData.totalOverduePayments}
                    </div>
                    <p className="text-sm text-gray-600">Overdue Payments</p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(analyticsData.overduePayments, currency)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>Claims Analytics</CardTitle>
              <CardDescription>
                Detailed claims processing metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimsDistributionChart
                detailed
                period={period}
                claimsData={claimsData as any}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>
                Customer acquisition and retention metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerGrowthChart
                period={period}
                customersData={customersData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
