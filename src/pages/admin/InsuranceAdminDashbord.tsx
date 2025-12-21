import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import AdminAllPolicies from "./AdminAllPolicies";
import AdminAllClaims from "./AdminAllClaims";
import AdminPayments from "./AdminPayments";
import AminAllCustomers from "./AdminAllCustomers";
import AdminAnalytics from "./AdminAnalytics";

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

const AdminAnalyticss = () => {
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
          <AdminAllClaims />
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <AdminPayments />
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <AminAllCustomers />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <AdminAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
