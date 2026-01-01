import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Shield, DollarSign, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import AdminAllPolicies from "./AdminAllPolicies";
import AdminAllClaims from "./AdminAllClaims";
import AdminPayments from "./AdminPayments";
import AminAllCustomers from "./AdminAllCustomers";
import AdminAnalytics from "./AdminAnalytics";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const { tab: urlTab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Define valid tabs
  const validTabs = [
    "policies",
    "claims",
    "payments",
    "customers",
    "analytics",
  ];

  // Get active tab from URL or default to "analytics"
  const activeTab = urlTab && validTabs.includes(urlTab) ? urlTab : "analytics";

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    navigate(`/admin/${value}`, { replace: true });
  };

  //Handle direct navigation to /admin (without tab)
  useEffect(() => {
    // If no tab in URL and we're at /admin, redirect to /admin/analytics
    if (!urlTab && location.pathname === "/admin") {
      navigate("/admin/analytics", { replace: true });
    }
  }, [urlTab, location.pathname, navigate]);

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

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-5 mb-2">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
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
        </TabsList>

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
