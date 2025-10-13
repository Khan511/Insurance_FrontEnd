import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  FileText,
  Shield,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AdminAllPolicies from "./AdminAllPolicies";

// Types
type AdminDashboardStats = {
  totalPolicies: number;
  activePolicies: number;
  pendingClaims: number;
  totalRevenue: number;
  monthlyGrowth: number;
  claimApprovalRate: number;
};

type AdminActivity = {
  id: number;
  type:
    | "POLICY_CREATED"
    | "CLAIM_SUBMITTED"
    | "PAYMENT_RECEIVED"
    | "USER_REGISTERED";
  description: string;
  timestamp: string;
  user: string;
};

// type AdminPolicy = {
//   id: number;
//   policyNumber: string;
//   customerName: string;
//   productType: string;
//   status: "ACTIVE" | "PENDING" | "EXPIRED" | "CANCELLED";
//   premium: number;
//   startDate: string;
//   endDate: string;
//   claimsCount: number;
// };

type Claim = {
  id: number;
  policyNumber: string;
  customerName: string;
  claimType: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  submittedDate: string;
  amount: number;
  description: string;
};

type Payment = {
  id: number;
  policyNumber: string;
  customerName: string;
  amount: number;
  status: "PAID" | "PENDING" | "OVERDUE" | "FAILED";
  dueDate: string;
  paidDate?: string;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  policiesCount: number;
  totalPremium: number;
  status: "ACTIVE" | "INACTIVE";
};

// Dummy Data
const dummyStats: AdminDashboardStats = {
  totalPolicies: 1247,
  activePolicies: 1089,
  pendingClaims: 23,
  totalRevenue: 245678,
  monthlyGrowth: 8.2,
  claimApprovalRate: 76.5,
};

const dummyActivities: AdminActivity[] = [
  {
    id: 1,
    type: "POLICY_CREATED",
    description: "New Life Insurance Policy purchased",
    user: "John Doe",
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    type: "CLAIM_SUBMITTED",
    description: "Death benefit claim submitted",
    user: "Jane Smith",
    timestamp: "1 hour ago",
  },
  {
    id: 3,
    type: "PAYMENT_RECEIVED",
    description: "Monthly premium payment received",
    user: "Mike Johnson",
    timestamp: "3 hours ago",
  },
  {
    id: 4,
    type: "USER_REGISTERED",
    description: "New customer registration",
    user: "Sarah Wilson",
    timestamp: "5 hours ago",
  },
  {
    id: 5,
    type: "POLICY_CREATED",
    description: "Auto Insurance Policy purchased",
    user: "Robert Brown",
    timestamp: "1 day ago",
  },
];

// const dummyPolicies: AdminPolicy[] = [
//   {
//     id: 1,
//     policyNumber: "LIFE-001",
//     customerName: "John Doe",
//     productType: "Life Insurance",
//     status: "ACTIVE",
//     premium: 1750,
//     startDate: "2024-01-15",
//     endDate: "2025-01-15",
//     claimsCount: 0,
//   },
//   {
//     id: 2,
//     policyNumber: "AUTO-002",
//     customerName: "Jane Smith",
//     productType: "Auto Insurance",
//     status: "ACTIVE",
//     premium: 1200,
//     startDate: "2024-02-01",
//     endDate: "2025-02-01",
//     claimsCount: 1,
//   },
//   {
//     id: 3,
//     policyNumber: "PROP-003",
//     customerName: "Mike Johnson",
//     productType: "Property Insurance",
//     status: "PENDING",
//     premium: 850,
//     startDate: "2024-03-10",
//     endDate: "2025-03-10",
//     claimsCount: 0,
//   },
//   {
//     id: 4,
//     policyNumber: "LIFE-004",
//     customerName: "Sarah Wilson",
//     productType: "Life Insurance",
//     status: "ACTIVE",
//     premium: 2100,
//     startDate: "2024-01-20",
//     endDate: "2025-01-20",
//     claimsCount: 0,
//   },
//   {
//     id: 5,
//     policyNumber: "AUTO-005",
//     customerName: "Robert Brown",
//     productType: "Auto Insurance",
//     status: "EXPIRED",
//     premium: 950,
//     startDate: "2023-12-01",
//     endDate: "2024-12-01",
//     claimsCount: 2,
//   },
// ];

const dummyClaims: Claim[] = [
  {
    id: 1,
    policyNumber: "AUTO-002",
    customerName: "Jane Smith",
    claimType: "Accident",
    status: "PENDING",
    submittedDate: "2024-03-15",
    amount: 5000,
    description: "Rear-end collision repair",
  },
  {
    id: 2,
    policyNumber: "LIFE-001",
    customerName: "John Doe",
    claimType: "Death Benefit",
    status: "UNDER_REVIEW",
    submittedDate: "2024-03-14",
    amount: 100000,
    description: "Death certificate submitted",
  },
  {
    id: 3,
    policyNumber: "PROP-003",
    customerName: "Mike Johnson",
    claimType: "Property Damage",
    status: "PENDING",
    submittedDate: "2024-03-13",
    amount: 2500,
    description: "Water damage repair",
  },
  {
    id: 4,
    policyNumber: "AUTO-005",
    customerName: "Robert Brown",
    claimType: "Theft",
    status: "APPROVED",
    submittedDate: "2024-03-10",
    amount: 15000,
    description: "Vehicle stolen from parking lot",
  },
  {
    id: 5,
    policyNumber: "LIFE-004",
    customerName: "Sarah Wilson",
    claimType: "Critical Illness",
    status: "REJECTED",
    submittedDate: "2024-03-08",
    amount: 50000,
    description: "Cancer treatment coverage",
  },
];

const dummyPayments: Payment[] = [
  {
    id: 1,
    policyNumber: "LIFE-001",
    customerName: "John Doe",
    amount: 1750,
    status: "PAID",
    dueDate: "2024-03-01",
    paidDate: "2024-03-01",
  },
  {
    id: 2,
    policyNumber: "AUTO-002",
    customerName: "Jane Smith",
    amount: 1200,
    status: "PENDING",
    dueDate: "2024-03-05",
  },
  {
    id: 3,
    policyNumber: "PROP-003",
    customerName: "Mike Johnson",
    amount: 850,
    status: "OVERDUE",
    dueDate: "2024-02-28",
  },
  {
    id: 4,
    policyNumber: "LIFE-004",
    customerName: "Sarah Wilson",
    amount: 2100,
    status: "PAID",
    dueDate: "2024-03-01",
    paidDate: "2024-03-01",
  },
  {
    id: 5,
    policyNumber: "AUTO-005",
    customerName: "Robert Brown",
    amount: 950,
    status: "FAILED",
    dueDate: "2024-03-02",
  },
];

const dummyCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@email.com",
    joinDate: "2024-01-15",
    policiesCount: 2,
    totalPremium: 3250,
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    joinDate: "2024-02-01",
    policiesCount: 1,
    totalPremium: 1200,
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    joinDate: "2024-03-10",
    policiesCount: 1,
    totalPremium: 850,
    status: "ACTIVE",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    joinDate: "2024-01-20",
    policiesCount: 1,
    totalPremium: 2100,
    status: "ACTIVE",
  },
  {
    id: "5",
    name: "Robert Brown",
    email: "robert.brown@email.com",
    joinDate: "2023-12-01",
    policiesCount: 1,
    totalPremium: 950,
    status: "INACTIVE",
  },
];

const analyticsData = {
  policiesByProduct: [
    { product: "Life Insurance", count: 650 },
    { product: "Auto Insurance", count: 420 },
    { product: "Property Insurance", count: 177 },
  ],
  claimsByType: [
    { type: "Accident", count: 45 },
    { type: "Theft", count: 23 },
    { type: "Natural Disaster", count: 15 },
    { type: "Death Benefit", count: 8 },
    { type: "Medical", count: 12 },
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 21500 },
    { month: "Feb", revenue: 22800 },
    { month: "Mar", revenue: 24500 },
    { month: "Apr", revenue: 23200 },
    { month: "May", revenue: 25100 },
    { month: "Jun", revenue: 26800 },
  ],
};

// Components
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
  color: "blue" | "green" | "yellow" | "emerald";
}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  };

  return (
    <Card className={colorClasses[color]}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs opacity-75">{description}</p>
          </div>
          <div className="p-2 bg-white rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const RecentActivities = () => {
  return (
    <div>
      {dummyActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-3 p-3 border rounded-lg"
        >
          <div className="p-1 bg-blue-100 rounded">
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.description}</p>
            <p className="text-xs text-gray-500">
              by {activity.user} • {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const PendingActions = () => {
  const actions = [
    {
      id: 1,
      type: "CLAIM_REVIEW",
      count: 5,
      description: "Claims waiting for review",
    },
    {
      id: 2,
      type: "DOCUMENT_VERIFICATION",
      count: 3,
      description: "Documents need verification",
    },
    {
      id: 3,
      type: "PAYMENT_ISSUES",
      count: 2,
      description: "Failed payments need attention",
    },
  ];

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <div
          key={action.id}
          className="flex justify-between items-center p-3 border rounded-lg"
        >
          <div>
            <p className="font-medium">
              {action.count} {action.type.replace("_", " ")}
            </p>
            <p className="text-sm text-gray-500">{action.description}</p>
          </div>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
            Review
          </button>
        </div>
      ))}
    </div>
  );
};

// const AdminPolicies = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredPolicies = dummyPolicies.filter(
//     (policy) =>
//       policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       policy.customerName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       ACTIVE: { color: "bg-green-100 text-green-800", label: "Active" },
//       PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
//       EXPIRED: { color: "bg-red-100 text-red-800", label: "Expired" },
//       CANCELLED: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
//     };

//     const config = statusConfig[status as keyof typeof statusConfig];
//     return <Badge className={config.color}>{config.label}</Badge>;
//   };

//   return (
//     <div className="">
//       <div className="flex justify-between items-center">
//         <div className="flex space-x-4">
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
//             <Input
//               placeholder="Search policies..."
//               className="pl-8 w-64"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <Button variant="outline" className="flex items-center gap-2">
//             <Filter className="h-4 w-4" />
//             Filter
//           </Button>
//         </div>
//         <Button className="flex items-center gap-2">
//           <Download className="h-4 w-4" />
//           Export
//         </Button>
//       </div>

//       <Card>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b bg-gray-50">
//                   <th className="text-left p-4 font-medium">Policy Number</th>
//                   <th className="text-left p-4 font-medium">Customer</th>
//                   <th className="text-left p-4 font-medium">Product Type</th>
//                   <th className="text-left p-4 font-medium">Status</th>
//                   <th className="text-left p-4 font-medium">Premium</th>
//                   <th className="text-left p-4 font-medium">Claims</th>
//                   <th className="text-left p-4 font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* {filteredPolicies.map((policy) => ( */}
//                 {filteredPolicies.map((policy) => (
//                   <tr key={policy.id} className="border-b hover:bg-gray-50">
//                     <td className="p-4 font-medium">{policy.policyNumber}</td>
//                     <td className="p-4">{policy.customerName}</td>
//                     <td className="p-4">{policy.productType}</td>
//                     <td className="p-4">{getStatusBadge(policy.status)}</td>
//                     <td className="p-4">${policy.premium}</td>
//                     <td className="p-4">{policy.claimsCount}</td>
//                     <td className="p-4">
//                       <div className="flex space-x-2">
//                         <Button variant="outline" size="sm">
//                           <Eye className="h-4 w-4" />
//                         </Button>
//                         <Button variant="outline" size="sm">
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

const AdminClaims = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClaims = dummyClaims.filter(
    (claim) =>
      claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      UNDER_REVIEW: {
        color: "bg-blue-100 text-blue-800",
        label: "Under Review",
      },
      APPROVED: { color: "bg-green-100 text-green-800", label: "Approved" },
      REJECTED: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleClaimAction = (claimId: number, action: string) => {
    alert(`Claim ${claimId} ${action}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search claims..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium">Claim ID</th>
                  <th className="text-left p-4 font-medium">Policy Number</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Description</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">#{claim.id}</td>
                    <td className="p-4">{claim.policyNumber}</td>
                    <td className="p-4">{claim.customerName}</td>
                    <td className="p-4">{claim.claimType}</td>
                    <td className="p-4">{getStatusBadge(claim.status)}</td>
                    <td className="p-4">${claim.amount.toLocaleString()}</td>
                    <td className="p-4 max-w-xs truncate">
                      {claim.description}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {claim.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleClaimAction(claim.id, "approved")
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleClaimAction(claim.id, "rejected")
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminPayments = () => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PAID: { color: "bg-green-100 text-green-800", label: "Paid" },
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      OVERDUE: { color: "bg-red-100 text-red-800", label: "Overdue" },
      FAILED: { color: "bg-gray-100 text-gray-800", label: "Failed" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-500">Total Collected</p>
            <p className="text-2xl font-bold">$245,678</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-500">
              Pending Payments
            </p>
            <p className="text-2xl font-bold">$12,450</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-500">Overdue</p>
            <p className="text-2xl font-bold">$3,250</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-500">Success Rate</p>
            <p className="text-2xl font-bold">94.5%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium">Payment ID</th>
                  <th className="text-left p-4 font-medium">Policy Number</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Due Date</th>
                  <th className="text-left p-4 font-medium">Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {dummyPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">#{payment.id}</td>
                    <td className="p-4">{payment.policyNumber}</td>
                    <td className="p-4">{payment.customerName}</td>
                    <td className="p-4">${payment.amount}</td>
                    <td className="p-4">{getStatusBadge(payment.status)}</td>
                    <td className="p-4">{payment.dueDate}</td>
                    <td className="p-4">{payment.paidDate || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminCustomers = () => {
  const getStatusBadge = (status: string) => {
    return status === "ACTIVE" ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search customers..." className="pl-8 w-64" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Join Date</th>
                  <th className="text-left p-4 font-medium">Policies</th>
                  <th className="text-left p-4 font-medium">Total Premium</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dummyCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{customer.name}</td>
                    <td className="p-4">{customer.email}</td>
                    <td className="p-4">{customer.joinDate}</td>
                    <td className="p-4">{customer.policiesCount}</td>
                    <td className="p-4">${customer.totalPremium}</td>
                    <td className="p-4">{getStatusBadge(customer.status)}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policies by Product */}
        <Card>
          <CardHeader>
            <CardTitle>Policies by Product Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.policiesByProduct.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.product}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(item.count / 1247) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Claims by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Claims by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.claimsByType.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(item.count / 103) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-2 h-48">
            {analyticsData.monthlyRevenue.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(item.revenue / 30000) * 100}%` }}
                ></div>
                <span className="text-xs mt-2">{item.month}</span>
                <span className="text-xs text-gray-500">
                  ${(item.revenue / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">76.5%</div>
            <p className="text-sm text-gray-600">Claim Approval Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <p className="text-sm text-gray-600">Customer Retention</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">2.3 days</div>
            <p className="text-sm text-gray-600">Avg. Claim Processing</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto my-5">
      <div className="flex justify-between items-center mb-3">
        <p className="text-3xl font-bold">Admin Dashboard</p>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 p-1">
            Admin User
          </Badge>
          {/* <Button variant="outline">Logout</Button> */}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 mb-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="claims" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Claims
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <StatsCard
              title="Total Policies"
              value="1,247"
              description="+12% from last month"
              icon={<FileText className="h-4 w-4" />}
              color="blue"
            />
            <StatsCard
              title="Active Policies"
              value="1,089"
              description="89% active rate"
              icon={<CheckCircle className="h-4 w-4" />}
              color="green"
            />
            <StatsCard
              title="Pending Claims"
              value="23"
              description="Needs review"
              icon={<AlertTriangle className="h-4 w-4" />}
              color="yellow"
            />
            <StatsCard
              title="Total Revenue"
              value="$245,678"
              description="+8.2% from last month"
              icon={<DollarSign className="h-4 w-4" />}
              color="emerald"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivities />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <PendingActions />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies">{<AdminAllPolicies />}</TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims">
          <AdminClaims />
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <AdminPayments />
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <AdminCustomers />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <AdminAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
