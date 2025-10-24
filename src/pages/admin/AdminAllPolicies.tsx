import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useGetAllClaimsQuery,
  useGetAllPoliciesQuery,
  useUpdatePolicyMutation,
} from "@/services/AdminSlice";
import type { InsuracePolicy, Beneficiaries } from "@/services/ServiceTypes";
import { Download, Edit, Filter, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const AdminAllPolicies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<InsuracePolicy | null>(
    null
  );
  const [editFormData, setEditFormData] = useState({
    status: "",
    premium: "",
    paymentFrequency: "",
    effectiveDate: "",
    expirationDate: "",
  });
  const [beneficiaries, setBeneficiaries] = useState<Beneficiaries[]>([]);

  const { data: allPolicies } = useGetAllPoliciesQuery();
  const { data: allClaims } = useGetAllClaimsQuery();
  const [updatePolicy] = useUpdatePolicyMutation();

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
      ACTIVE: {
        color:
          "bg-green-100 text-green-800 px-1 py-1 flex items-center justify-center",
        label: "Active",
      },
      PENDING: {
        color:
          "bg-yellow-100 text-yellow-800 px-1 py-1 flex items-center justify-center",
        label: "Pending",
      },
      EXPIRED: {
        color:
          "bg-red-100 text-red-800 px-1 py-1 flex items-center justify-center",
        label: "Expired",
      },
      CANCELLED: {
        color:
          "bg-gray-100 text-gray-800 px-1 py-1 flex items-center justify-center",
        label: "Cancelled",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // Helper to format date from [year, month, day] array
  const formatDate = (dateString?: Date | string | null): string => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString?: Date | string | null): string => {
    if (!dateString) return "";

    const date = new Date(dateString);

    // Get local date components (this avoids timezone issues)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Get next pending payment for a specific policy
  const getNextPendingPayment = (policy: InsuracePolicy) => {
    if (!policy.paymentSchedules) return null;

    return policy.paymentSchedules
      ?.filter((schedule) => schedule.status === "PENDING")
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )[0];
  };

  // Open edit modal and populate form data
  const handleEditClick = (policy: InsuracePolicy) => {
    setSelectedPolicy(policy);

    console.log("Policy date check", policy);

    setEditFormData({
      status: policy.status,
      premium: policy.premium,
      paymentFrequency: policy.paymentFrequency,
      effectiveDate: formatDateForInput(policy.validityPeriod?.effectiveDate),
      expirationDate: formatDateForInput(policy.validityPeriod?.expirationDate),
    });

    // Initialize beneficiaries from the policy
    setBeneficiaries(policy.beneficiaries || []);

    setIsEditModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle beneficiary changes
  const handleBeneficiaryChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index] = {
      ...updatedBeneficiaries[index],
      [field]: value,
    };
    setBeneficiaries(updatedBeneficiaries);
  };

  // Add new beneficiary
  const handleAddBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      {
        name: "",
        relationship: "",
        dateOfBirth: "",
      },
    ]);
  };

  // Remove beneficiary
  const handleRemoveBeneficiary = (index: number) => {
    const updatedBeneficiaries = beneficiaries.filter((_, i) => i !== index);
    setBeneficiaries(updatedBeneficiaries);
  };

  // Save policy changes
  const handleSaveChanges = async () => {
    try {
      const updateData: any = {
        id: selectedPolicy?.id,
        status: editFormData.status,
        premium: parseFloat(editFormData.premium),
        paymentFrequency: editFormData.paymentFrequency,
        validityPeriod: {
          effectiveDate: editFormData.effectiveDate,
          expirationDate: editFormData.expirationDate,
        },
      };
      // Only include beneficiries if they exist and valid
      const validateBeneficires = beneficiaries.filter(
        (ben) => ben.name.trim() != ""
      );
      if (validateBeneficires.length > 0) {
        updateData.beneficiaries = validateBeneficires;
      }

      beneficiaries: beneficiaries.filter((b) => b.name.trim() !== ""),
        await updatePolicy(updateData).unwrap();
      setIsEditModalOpen(false);
      setSelectedPolicy(null);
      setBeneficiaries([]);
    } catch (error) {
      console.error("Failed to update policy:", error);
    }
  };

  console.log("Edit format data", editFormData);
  console.log("Admin All Policies", allPolicies);
  console.log("Admin All Claims", allClaims);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <div className="relative flex items-center">
            <Search className="absolute left-2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search policies..."
              className="px-5 w-64"
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
                  <th className="text-left p-3 font-medium">Product Type</th>
                  <th className="text-center p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Total Premium</th>
                  <th className="text-left p-4 font-medium">Next Payment</th>
                  <th className="text-left p-4 font-medium">Start Date</th>
                  <th className="text-left p-4 font-medium">End Date</th>
                  <th className="text-left p-4 font-medium">Beneficiaries</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPolicies?.map((policy) => {
                  const nextPayment = getNextPendingPayment(policy);
                  console.log("Nextpayment", nextPayment);

                  return (
                    <tr key={policy.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{policy.policyNumber}</td>
                      <td className="p-4">{policy.policiyHolderName}</td>
                      <td className="p-4">{policy.productType}</td>
                      <td className="p-4 text-center">
                        {getStatusBadge(policy.status)}
                      </td>
                      <td className="flex flex-col p-4">
                        <span>
                          {policy.premium}/
                          <span className="text-gray-400 text-sm">
                            {policy.currency}
                          </span>
                        </span>
                      </td>

                      {/* Next Payment Column - FIXED */}
                      <td className="p-4">
                        {nextPayment ? (
                          <div className="space-y-1">
                            <div className="font-medium">
                              {nextPayment.dueAmount} {policy.currency}
                            </div>
                            <div className="text-xs text-gray-500">
                              {policy.paymentFrequency}
                            </div>
                            <div className="text-xs text-gray-500">
                              Due: {formatDate(nextPayment.dueDate)}
                            </div>
                            {nextPayment.status && (
                              <Badge
                                variant="outline"
                                className={
                                  nextPayment.status === "OVERDUE"
                                    ? "text-red-500 border-red-200"
                                    : "text-green-500 border-green-200"
                                }
                              >
                                {nextPayment.status}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            No pending payments
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-sm">
                        {formatDate(policy.validityPeriod?.effectiveDate)}
                      </td>
                      <td className="p-4 text-sm">
                        {formatDate(policy.validityPeriod?.expirationDate)}
                      </td>
                      <td className="p-4">
                        {policy.beneficiaries &&
                        policy.beneficiaries.length > 0 ? (
                          <div className="space-y-1">
                            {policy.beneficiaries.map((bene, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="font-medium">{bene.name}</span>
                                {bene.relationship && (
                                  <span className="text-gray-500">
                                    {" "}
                                    ({bene.relationship})
                                  </span>
                                )}
                                {bene.dateOfBirth && (
                                  <span className="text-gray-400 text-xs block">
                                    DOB: {formatDate(bene.dateOfBirth)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(policy)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Policy Modal */}
      {isEditModalOpen && selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4">
            <div className="">
              <h2 className="text-xl font-semibold mb-4">
                Edit Policy: {selectedPolicy.policyNumber}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Policy Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Policy Details
                  </h3>

                  {/* Policy Status */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">
                      Policy Status
                    </label>
                    <select
                      value={editFormData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="PENDING">Pending</option>
                      <option value="EXPIRED">Expired</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  {/* Premium Amount */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">
                      Premium Amount
                    </label>
                    <Input
                      type="number"
                      value={editFormData.premium}
                      onChange={(e) =>
                        handleInputChange("premium", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Payment Frequency */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">
                      Payment Frequency
                    </label>
                    <select
                      value={editFormData.paymentFrequency}
                      onChange={(e) =>
                        handleInputChange("paymentFrequency", e.target.value)
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="ANNUAL">Annual</option>
                    </select>
                  </div>

                  {/* Coverage Period */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">
                      Coverage Period
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Effective Date
                        </label>
                        <Input
                          type="date"
                          value={editFormData.effectiveDate}
                          onChange={(e) =>
                            handleInputChange("effectiveDate", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Expiration Date
                        </label>
                        <Input
                          type="date"
                          value={editFormData.expirationDate}
                          onChange={(e) =>
                            handleInputChange("expirationDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Beneficiaries */}
                {selectedPolicy.beneficiaries.length > 0 &&
                  selectedPolicy.beneficiaries != null && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-4">
                        <h3 className="text-lg font-medium">Beneficiaries</h3>
                        <button
                          type="button"
                          onClick={handleAddBeneficiary}
                          className="flex  items-center gap-1 btn bg-black text-white  "
                        >
                          {/* <span>
                            <Plus className="h-4 w-4" />
                          </span> */}
                          <span>Add Beneficiary</span>
                        </button>
                      </div>

                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {beneficiaries.length > 0 ? (
                          beneficiaries.map((beneficiary, index) => (
                            <div
                              key={index}
                              className="border rounded-lg p-3 space-y-2"
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">
                                  Beneficiary {index + 1}
                                </h4>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  color="red"
                                  onClick={() => handleRemoveBeneficiary(index)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Full Name
                                  </label>
                                  <Input
                                    value={beneficiary.name}
                                    onChange={(e) =>
                                      handleBeneficiaryChange(
                                        index,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter full name"
                                    className="w-full"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Relationship
                                  </label>
                                  <select
                                    value={beneficiary.relationship || ""}
                                    onChange={(e) =>
                                      handleBeneficiaryChange(
                                        index,
                                        "relationship",
                                        e.target.value
                                      )
                                    }
                                    className="w-full p-2 border rounded-md text-sm"
                                  >
                                    <option value="">
                                      Select Relationship
                                    </option>
                                    <option value="SPOUSE">Spouse</option>
                                    <option value="CHILD">Child</option>
                                    <option value="PARENT">Parent</option>
                                    <option value="SIBLING">Sibling</option>
                                    <option value="OTHER">Other</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Date of Birth
                                  </label>
                                  <Input
                                    type="date"
                                    value={
                                      beneficiary.dateOfBirth
                                        ? formatDateForInput(
                                            beneficiary.dateOfBirth
                                          )
                                        : ""
                                    }
                                    onChange={(e) =>
                                      handleBeneficiaryChange(
                                        index,
                                        "dateOfBirth",
                                        e.target.value
                                      )
                                    }
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p>No beneficiaries added</p>
                            <p className="text-sm">
                              Click "Add Beneficiary" to add one
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              <div className="flex justify-end gap-3 space-x-3 mt-5 pt-4 border-t">
                <button
                  className="btn outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button onClick={handleSaveChanges} className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllPolicies;
