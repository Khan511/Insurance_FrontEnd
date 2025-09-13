import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { User, FileText, Activity, CreditCard, Plus } from "lucide-react";
import MyPolicies from "@/components/mypage/myPolicies/MyPolicies";
import MyClaims from "@/components/mypage/myClaims/MyClaims";
import Mypayments from "@/components/mypage/MyPayments";
import MyDocuments from "@/components/mypage/MyDocuments";
import { Link } from "react-router";
import { useGetAllPoliciesOfUserQuery } from "@/services/InsurancePolicySlice";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";

// Mock data - replace with real API data
const policies = [
  {
    id: 1,
    number: "POL-87654321",
    type: "Auto Insurance",
    status: "Active",
    premium: "$120.00",
    renewal: "2024-12-15",
  },
  {
    id: 2,
    number: "POL-12345678",
    type: "Home Insurance",
    status: "Active",
    premium: "$85.50",
    renewal: "2025-03-22",
  },
  {
    id: 3,
    number: "POL-13579246",
    type: "Life Insurance",
    status: "Inactive",
    premium: "$210.75",
    renewal: "2024-11-30",
  },
];

const claims = [
  {
    id: 1,
    number: "CLM-987654",
    date: "2024-06-15",
    type: "Auto Collision",
    status: "Approved",
    amount: "$2,500.00",
  },
  {
    id: 2,
    number: "CLM-123456",
    date: "2024-05-22",
    type: "Property Damage",
    status: "Pending",
    amount: "$1,200.00",
  },
  {
    id: 3,
    number: "CLM-567890",
    date: "2024-04-10",
    type: "Medical Expense",
    status: "Rejected",
    amount: "$850.00",
  },
];

const upcomingPayments = [
  { id: 1, policy: "POL-87654321", amount: "$120.00", dueDate: "2024-09-15" },
  { id: 2, policy: "POL-12345678", amount: "$85.50", dueDate: "2024-10-22" },
];

const documents = [
  { id: 1, name: "Auto Policy Document", type: "PDF", date: "2024-01-15" },
  { id: 2, name: "Claim Form - Auto", type: "DOCX", date: "2024-06-20" },
  { id: 3, name: "Insurance Certificate", type: "PDF", date: "2024-02-10" },
];

export default function MyPage() {
  const { data: currentUser } = useGetCurrenttUserQuery();
  const userId = currentUser?.data?.user?.userId;

  const { data: myAllPolicies, isLoading } = useGetAllPoliciesOfUserQuery(
    userId || "",
    {
      skip: !userId,
    }
  );

  console.log("Plicies: ", myAllPolicies);

  return (
    <div className="container mx-auto px-4 py-5">
      <div className="flex flex-col md:flex-row justify-between items-start ">
        <div>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's an overview of your insurance policies and
            activities.
          </p>
        </div>
        <Link
          to="/my-claim"
          className=" md:mt-0  flex justify-center items-center gap-0.5 bg-blue-500 py-2 px-2 rounded-md text-white font-semibold"
        >
          <Plus className="mr-2 h-4 w-4   " />
          New Claim
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        <Card className="p-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">All Policies</CardTitle>
            <FileText className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myAllPolicies?.length}</div>
            {/* <p className="text-xs text-gray-500"> 2 active, 1 inactive</p> */}
          </CardContent>
        </Card>
        {/* <Card className="p-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Policies
            </CardTitle>
            <FileText className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-gray-500">2 active, 1 inactive</p>
          </CardContent>
        </Card> */}

        <Card className="p-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Claims</CardTitle>
            <Activity className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-gray-500">1 pending, 1 approved</p>
          </CardContent>
        </Card>

        <Card className="p-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Payments
            </CardTitle>
            <CreditCard className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-gray-500">Next due in 45 days</p>
          </CardContent>
        </Card>

        <Card className="p-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Account Since</CardTitle>
            <User className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2023</div>
            <p className="text-xs text-gray-500">Member for 1.5 years</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="policies" className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
          <TabsTrigger value="policies">My Policies</TabsTrigger>
          <TabsTrigger value="claims">My Claims</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Policies Tab */}
        <MyPolicies policies={myAllPolicies ?? []} />

        {/* Claims Tab */}
        <MyClaims claims={claims} />

        {/* Payments Tab */}
        <Mypayments upcomingPayments={upcomingPayments} />

        {/* Documents Tab */}
        <MyDocuments documents={documents} />
      </Tabs>

      {/* Additional Suggestions Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">More Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <Card className="hover:shadow-md transition-shadow p-2">
            <CardHeader>
              <CardTitle className="text-lg">Policy Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Get personalized insurance recommendations based on your needs
              </p>
              <Button variant="outline">View Suggestions</Button>
            </CardContent>
          </Card> */}

          <Card className="hover:shadow-md transition-shadow p-2">
            <CardHeader>
              <CardTitle className="text-lg">Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Access 24/7 support and emergency service contacts
              </p>
              <Button variant="outline">View Contacts</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow p-2">
            <CardHeader>
              <CardTitle className="text-lg">Insurance Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Connect with your dedicated insurance agent
              </p>
              <Button variant="outline">Find Agent</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
