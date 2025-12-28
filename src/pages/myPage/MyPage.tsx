import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { User, FileText, Activity, CreditCard, Plus } from "lucide-react";
import MyPolicies from "@/components/mypage/myPolicies/MyPolicies";
import MyClaimComponent from "@/components/mypage/myClaims/MyClaims";
import Mypayments from "@/components/mypage/myPayments/MyPayments";
import { Link, useNavigate, useParams } from "react-router";
import { useGetAllPoliciesOfUserQuery } from "@/services/InsurancePolicySlice";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { useGetAllClaimsOfUserQuery } from "@/services/ClaimMetaDataApi";

import { membershipDuration } from "@/components/memberShipDuration/MembershipDuration";
import { Spinner } from "react-bootstrap";
import { getUpcomingPayments } from "@/components/mypage/Utils";
import { TabsContent } from "@radix-ui/react-tabs";

export default function MyPage() {
  const { tab = "policies" } = useParams();
  const navigate = useNavigate();
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

  const upcomingPayments = getUpcomingPayments(myAllPolicies || [], 20);

  console.log("UpcomingPayments", upcomingPayments);

  if (isLoading)
    return (
      <div className=" flex justify-center items-center ext-center mt-5 mx-auto">
        <Spinner />
      </div>
    );

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
          to="/file-claim"
          className=" md:mt-0  flex justify-center items-center gap-0.5 bg-blue-500 py-2 px-2 rounded-md text-white font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
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
            {/* Upcoming Payments Section - FIXED LINE BELOW */}
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {upcomingPayments.length}
              </div>
              <p className="text-xs text-gray-500">Next due in 20 days</p>
            </CardContent>
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
      <Tabs
        className="w-full "
        value={tab}
        onValueChange={(value) => navigate(`/my-page/${value}`)}
      >
        <TabsList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full ">
          <TabsTrigger
            value="policies"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
          >
            My Policies
          </TabsTrigger>
          <TabsTrigger
            value="claims"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
          >
            My Claims
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
          >
            My Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="mt-6">
          <MyPolicies />
        </TabsContent>

        <TabsContent value="claims" className="mt-6">
          <MyClaimComponent />
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Mypayments />
        </TabsContent>
      </Tabs>

      {/* Additional Suggestions Section */}
      {/* <div className="mt-5">
        <p className="text-xl font-bold mb-4">More Services</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow p-2">
            <CardHeader>
              <CardTitle className="text-lg">Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Access 24/7 support and emergency service contacts
              </p>
              <Link to="/all-products" className="btn outline">
                View Contacts
              </Link>
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
        */}
    </div>
  );
}
