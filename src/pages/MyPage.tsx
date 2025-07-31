import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
 
import {
  User,
  FileText,
  Activity,
  CreditCard,
  Calendar,
  Download,
  Plus,
} from "lucide-react";

// Mock data - replace with real API data
const policies = [
  { id: 1, number: "POL-87654321", type: "Auto Insurance", status: "Active", premium: "$120.00", renewal: "2024-12-15" },
  { id: 2, number: "POL-12345678", type: "Home Insurance", status: "Active", premium: "$85.50", renewal: "2025-03-22" },
  { id: 3, number: "POL-13579246", type: "Life Insurance", status: "Inactive", premium: "$210.75", renewal: "2024-11-30" }
];

const claims = [
  { id: 1, number: "CLM-987654", date: "2024-06-15", type: "Auto Collision", status: "Approved", amount: "$2,500.00" },
  { id: 2, number: "CLM-123456", date: "2024-05-22", type: "Property Damage", status: "Pending", amount: "$1,200.00" },
  { id: 3, number: "CLM-567890", date: "2024-04-10", type: "Medical Expense", status: "Rejected", amount: "$850.00" }
];

const upcomingPayments = [
  { id: 1, policy: "POL-87654321", amount: "$120.00", dueDate: "2024-09-15" },
  { id: 2, policy: "POL-12345678", amount: "$85.50", dueDate: "2024-10-22" }
];

const documents = [
  { id: 1, name: "Auto Policy Document", type: "PDF", date: "2024-01-15" },
  { id: 2, name: "Claim Form - Auto", type: "DOCX", date: "2024-06-20" },
  { id: 3, name: "Insurance Certificate", type: "PDF", date: "2024-02-10" }
];

export default function MyPage() {
  return (
    <div className="container mx-auto px-4 py-5">
      <div className="flex flex-col md:flex-row justify-between items-start ">
        <div>
       
          <p className="text-gray-600 mt-2">
            Welcome back! Here's an overview of your insurance policies and activities.
          </p>
        </div>
        <Button className="md:mt-0 text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Claim
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        <Card className="p-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <FileText className="h-5 w-5 text-blue-500" />
           </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-gray-500">2 active, 1 inactive</p>
          </CardContent>
        </Card>

           <Card className="p-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <Activity className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-gray-500">1 pending, 1 approved</p>
          </CardContent>
        </Card>
        
         <Card className="p-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Payments</CardTitle>
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
        <TabsContent value="policies">
          <Card className="mt-6">
            <CardHeader className="pt-4 text-center text-2xl text-blue-500">
              <CardTitle>Insurance Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {policies.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-semibold">{policy.type}</h3>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            policy.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {policy.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Policy #: {policy.number}</p>
                      </div>
                      
                      <div className="mt-3 sm:mt-0 text-right">
                        <p className="font-medium">{policy.premium}/mo</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Renewal: {policy.renewal}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Make Payment</Button>
                      <Button variant="outline" size="sm">File Claim</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Claims Tab */}
        <TabsContent value="claims">
          <Card className="mt-6">
                <CardHeader className="pt-4 text-center text-2xl text-blue-500">
              <CardTitle>Insurance Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {claims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <h3 className="font-semibold">{claim.type}</h3>
                        <p className="text-sm text-gray-600 mt-1">Claim #: {claim.number}</p>
                      </div>
                      
                      <div className="mt-3 sm:mt-0">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          claim.status === 'Approved' 
                            ? 'bg-green-100 text-green-800' 
                            : claim.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {claim.status}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">Filed: {claim.date}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap justify-between items-center">
                      <p className="font-medium">Amount: {claim.amount}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Upload Documents</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card className="mt-6">
          <CardHeader className="pt-4 text-center text-2xl text-blue-500">
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Upcoming Payments</h3>
                <div className="space-y-4">
                  {upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Policy #{payment.policy}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due: {payment.dueDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{payment.amount}</p>
                        <Button size="sm" className="text-white">Pay Now</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Payment History</h3>
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent payments found</p>
                  <Button variant="link" className="mt-2">View full history</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card className="mt-6">
            <CardHeader className="pt-4 text-center text-2xl text-blue-500">
              <CardTitle>Policy Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-lg mr-4">
                        <FileText className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type} • {doc.date}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Additional Suggestions Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">More Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow p-2">
            <CardHeader>
              <CardTitle className="text-lg">Policy Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Get personalized insurance recommendations based on your needs</p>
              <Button variant="outline">View Suggestions</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow p-2">
            <CardHeader>
              <CardTitle className="text-lg">Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Access 24/7 support and emergency service contacts</p>
              <Button variant="outline">View Contacts</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow p-2">
            <CardHeader>
              <CardTitle className="text-lg">Insurance Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Connect with your dedicated insurance agent</p>
              <Button variant="outline">Find Agent</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}