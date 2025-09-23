import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { User, FileText, Activity, CreditCard, Plus } from "lucide-react";
import MyPolicies from "@/components/mypage/myPolicies/MyPolicies";
import MyClaimComponent from "@/components/mypage/myClaims/MyClaims";
import Mypayments from "@/components/mypage/MyPayments";
import { Link } from "react-router";
import { useGetAllPoliciesOfUserQuery } from "@/services/InsurancePolicySlice";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { useGetAllClaimsOfUserQuery } from "@/services/ClaimMetaDataApi";
import { membershipDuration } from "./MembershipDuration";

const upcomingPayments = [
  { id: 1, policy: "POL-87654321", amount: "$120.00", dueDate: "2024-09-15" },
  { id: 2, policy: "POL-12345678", amount: "$85.50", dueDate: "2024-10-22" },
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

  const { data: myClaims } = useGetAllClaimsOfUserQuery(userId || "", {
    skip: !userId,
  });

  const createdAt = new Date(
    currentUser?.data.user.createdAt || ""
  ).getFullYear();

  const activePolicies = myAllPolicies?.filter(
    (policy) => policy.status === "ACTIVE"
  );
  const inActivePolicies = myAllPolicies?.filter(
    (policy) => policy.status === "EXPIRED"
  );

  const pendingClaims = myClaims?.claim.filter(
    (cla) => cla.status === "PENDING"
  );
  const approvedClaims = myClaims?.claim.filter(
    (cla) => cla.status === "APPROVED"
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
            <div className="text-2xl mb-2 font-bold">
              {myAllPolicies?.length}
            </div>
            <p className="text-xs text-gray-500">
              {" "}
              <span className="font-bold">{activePolicies?.length} </span>
              active,{" "}
              <span className="font-bold">{inActivePolicies?.length} </span>
              inactive
            </p>
          </CardContent>
        </Card>

        <Card className="p-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Claims</CardTitle>
            <Activity className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {myClaims?.claim.length}
            </div>
            <p className="text-xs text-gray-500">
              <span className="font-bold">{pendingClaims?.length}</span>{" "}
              pending,{" "}
              <span className="font-bold">{approvedClaims?.length} </span>
              approved
            </p>
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
            <div className="text-2xl font-bold mb-2"> {createdAt}</div>
            <p className="text-xs text-gray-500">
              Member since{" "}
              {membershipDuration(currentUser?.data.user.createdAt)}{" "}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="policies" className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
          <TabsTrigger value="policies">My Policies</TabsTrigger>
          <TabsTrigger value="claims">My Claims</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
        </TabsList>

        {/* Policies Tab */}
        <MyPolicies />

        {/* Claims Tab */}
        <MyClaimComponent />
        {/* <MyClaimComponent claims={claims} /> */}

        {/* Payments Tab */}
        <Mypayments upcomingPayments={upcomingPayments} />

        {/* Documents Tab */}
        {/* <MyDocuments documents={documents} /> */}
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
