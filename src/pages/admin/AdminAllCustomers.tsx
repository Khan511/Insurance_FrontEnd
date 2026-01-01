import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllCustomersQuery } from "@/services/AdminSlice";
import { Edit, Eye, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AminAllCustomers = () => {
  const navigate = useNavigate();
  const { data: customers, isLoading } = useGetAllCustomersQuery();

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE" ? (
      <Badge className="bg-green-100 text-green-800 p-1 ">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 p-1 ">Inactive</Badge>
    );
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log(customers);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search customers..." className=" px-4 w-64" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        {/* <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button> */}
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
                {customers &&
                  customers.map((customer, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">
                        {customer.customerFirstname +
                          " " +
                          customer.customerLastname}
                      </td>
                      <td className="p-4">{customer.email}</td>
                      <td className="p-4">{formatDate(customer.joinDate)}</td>
                      <td className="p-4">{customer.numberOfPolicies}</td>
                      <td className="p-4">
                        {customer.currency}
                        {customer.premium}
                      </td>
                      <td className="p-4">{getStatusBadge(customer.status)}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/admin/customers/${customer.customerId}`
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/admin/customers/${customer.customerId}/edit`
                              )
                            }
                          >
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

export default AminAllCustomers;
