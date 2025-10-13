import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllPoliciesQuery } from "@/services/AdminSlice";
import { Download, Edit, Eye, Filter, Search } from "lucide-react";
import { useState } from "react";

const AdminAllPolicies = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allPolicies } = useGetAllPoliciesQuery();

  const filteredPolicies =
    allPolicies &&
    allPolicies?.filter(
      (policy) =>
        policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.policiyHolderName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { color: "bg-green-100 text-green-800", label: "Active" },
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      EXPIRED: { color: "bg-red-100 text-red-800", label: "Expired" },
      CANCELLED: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  console.log("Admin All Policies", allPolicies);

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search policies..."
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
                  <th className="text-left p-4 font-medium">Policy Number</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Product Type</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Premium</th>
                  <th className="text-left p-4 font-medium">Claims</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {filteredPolicies.map((policy) => ( */}
                {filteredPolicies?.map((policy) => (
                  <tr key={policy.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{policy.policyNumber}</td>
                    <td className="p-4">{policy.policiyHolderName}</td>
                    <td className="p-4">{policy.productType}</td>
                    <td className="p-4">{getStatusBadge(policy.status)}</td>
                    <td className="p-4">${policy.premium}</td>
                    <td className="p-4">ClaimsCount:</td>
                    {/* <td className="p-4">{policy.claimsCount}</td> */}
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
export default AdminAllPolicies;
