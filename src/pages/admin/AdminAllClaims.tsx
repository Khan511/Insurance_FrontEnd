import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllClaimsQuery,
  useUpdateClaimMutation,
} from "@/services/AdminSlice";
import type { ClaimApiResponse } from "@/pages/claim/Types";
import {
  Download,
  Edit,
  Eye,
  Search,
  FileText,
  MapPin,
  User,
  Calendar,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";
import { useFileDownload } from "@/components/mypage/myClaims/useFileDownlaod";

type GetClaimsResponse = {
  claim: ClaimApiResponse[];
};

// Edit form type
type EditClaimForm = {
  status: string;
  claimId: string;
  amount: string | null;
  incidentDetails: {
    description: string;
    policeReportNumber: string;
    location: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    thirdPartyInvolved: boolean;
    thirdPartyDetails: {
      name: string;
      contactInfo: string;
      insuranceInfo: string;
    };
  };
};

const AdminAllClaims = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { downloadFile, activeKey, error } = useFileDownload();
  const [selectedClaim, setSelectedClaim] = useState<ClaimApiResponse | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditClaimForm | null>(null);

  const { data: allClaimsResponse, refetch } = useGetAllClaimsQuery();
  const [updateClaim, { isLoading: isUpdating }] = useUpdateClaimMutation();

  // Correctly access the claims array from the response
  const allClaims: ClaimApiResponse[] = allClaimsResponse || [];

  const filteredClaims = allClaims?.filter(
    (claim) =>
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.incidentDetails.type
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200 px-2 py-1",
        label: "Pending",
      },
      APPROVED: {
        color: "bg-green-100 text-green-800 border-green-200 px-2 py-1",
        label: "Approved",
      },
      REJECTED: {
        color: "bg-red-100 text-red-800 border-red-200 px-2 py-1",
        label: "Rejected",
      },
      UNDER_REVIEW: {
        color: "bg-blue-100 text-blue-800 border-blue-200 px-2 py-1",
        label: "Under Review",
      },
      PROCESSING: {
        color: "bg-purple-100 text-purple-800 border-purple-200 px-2 py-1",
        label: "Processing",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getClaimTypeBadge = (claimType: string) => {
    const typeConfig = {
      HOME_DAMAGE: {
        color: "bg-orange-100 text-orange-800 px-2 py-1",
        label: "Home Damage",
      },
      FIRE: {
        color: "bg-red-100 text-red-800 px-2 py-1",
        label: "Fire",
      },
      THEFT: {
        color: "bg-gray-100 text-gray-800 px-2 py-1",
        label: "Theft",
      },
      WATER_DAMAGE: {
        color: "bg-green-100 text-green-800 px-2 py-1",
        label: "Water Damage",
      },
      AUTOMOBILE_COLLISION: {
        color: "bg-blue-100 text-blue-800 px-2 py-1",
        label: "AUTOMOBILE COLLISION",
      },
      HEALTH_HOSPITALIZATION: {
        color: "bg-purple-100 text-purple-800 px-2 py-1",
        label: "HEALTH_HOSPITALIZATION",
      },
    };

    const config = typeConfig[claimType as keyof typeof typeConfig] || {
      color: "bg-gray-100 text-gray-800",
      label: claimType,
    };

    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  // Define the exact type
  type IncidentDateTime = [
    number,
    number,
    number,
    (number | undefined)?,
    (number | undefined)?
  ];

  const formatDate = (dateArray: IncidentDateTime) => {
    if (!dateArray || dateArray.length < 3) return "Date not available";

    const [year, month, day, hour = 0, minute = 0] = dateArray;

    const date = new Date(year, month - 1, day, hour, minute);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === null || amount === undefined) return "Not specified";
    return new Intl.NumberFormat("dk-DK", {
      style: "currency",
      currency: "DKK",
    }).format(amount);
  };

  const handleViewClaim = (claim: ClaimApiResponse) => {
    setSelectedClaim(claim);
    setIsViewModalOpen(true);
  };

  const handleEditClaim = (claim: ClaimApiResponse) => {
    setSelectedClaim(claim);
    setEditForm({
      status: claim.status,
      claimId: claim.claimNumber,
      amount: claim.amount || null,
      incidentDetails: {
        description: claim.incidentDetails.description,
        policeReportNumber: claim.incidentDetails.policeReportNumber || "",
        location: { ...claim.incidentDetails.location },
        thirdPartyInvolved: claim.incidentDetails.thirdPartyInvolved,
        thirdPartyDetails: claim.incidentDetails.thirdPartyInvolved
          ? { ...claim.incidentDetails.thirdPartyDetails }
          : { name: "", contactInfo: "", insuranceInfo: "" },
      },
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedClaim || !editForm) return;

    try {
      await updateClaim({
        // claimId: selectedClaim.claimNumber,
        updates: editForm,
      }).unwrap();

      // Refresh the claims list
      refetch();
      setIsEditModalOpen(false);
      setEditForm(null);

      // Show success message (you can add a toast here)
      console.log("Claim updated successfully");
    } catch (error) {
      console.error("Failed to update claim:", error);
      // Show error message (you can add a toast here)
    }
  };

  const handleDownload = (fileKey: string | null, fileName: string) => {
    if (fileKey) {
      downloadFile(fileKey, fileName);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (!editForm) return;

    setEditForm((prev) => {
      if (!prev) return prev;

      const fieldParts = field.split(".");
      const newForm = { ...prev };

      let current: any = newForm;
      for (let i = 0; i < fieldParts.length - 1; i++) {
        current = current[fieldParts[i]];
      }
      current[fieldParts[fieldParts.length - 1]] = value;

      return newForm;
    });
  };

  console.log("SelectedClaim", selectedClaim);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <p className="text-2xl font-semibold text-grau-600 mt-2 mb-0">
          Claims Management
        </p>

        <div className="flex items-center space-x-4 gap-1.5">
          <div className="relative">
            <Search className="absolute left-1 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search claims..."
              className="px-4 w-64 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button> */}
          <Button className="flex items-center gap-2 text-white rounded">
            <Download className="h-4 w-4 text-white " />
            Export
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
                  <th className="text-left p-4 font-medium">Claim Number</th>
                  <th className="text-left p-4 font-medium">Policy Number</th>
                  <th className="text-left p-4 font-medium">Claim Type</th>
                  <th className="text-left p-4 font-medium">Incident Type</th>
                  <th className="text-left p-4 font-medium">Incident Date</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Documents</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims?.map((claim, index) => (
                  <tr
                    key={claim.claimNumber}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 font-mono font-medium">#{index + 1}</td>
                    <td className="p-4 font-mono font-medium">
                      {claim.claimNumber}
                    </td>
                    <td className="p-4 font-mono">{claim.policyNumber}</td>
                    <td className="p-4 ">
                      {getClaimTypeBadge(claim.claimType)}
                    </td>
                    <td className="p-4 capitalize">
                      {claim.incidentDetails.type
                        .toLowerCase()
                        .replace("_", " ")}
                    </td>
                    <td className="p-4 text-sm">
                      {formatDate(claim.incidentDetails.incidentDateTime)}
                    </td>
                    <td className="p-4 font-medium">
                      {formatCurrency(claim.amount as number | undefined)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {claim.documents.length}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(claim.status)}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewClaim(claim)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClaim(claim)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredClaims?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No claims found</p>
                {searchTerm && (
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search terms
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* View Claim Modal */}
      {isViewModalOpen && selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Claim: {selectedClaim.claimNumber}
                  </h2>
                  <p className="text-gray-600">
                    Policy: {selectedClaim.policyNumber}
                  </p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedClaim.status)}
                  {getClaimTypeBadge(selectedClaim.claimType)}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Incident Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Type
                          </label>
                          <p className="capitalize">
                            {selectedClaim.incidentDetails.type
                              .toLowerCase()
                              .replace("_", " ")}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Date & Time
                          </label>
                          <p>
                            {formatDate(
                              selectedClaim.incidentDetails.incidentDateTime
                            )}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Police Report
                          </label>
                          <p>
                            {selectedClaim.incidentDetails.policeReportNumber ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Location
                      </h3>
                      <div className="space-y-2">
                        <p>{selectedClaim.incidentDetails.location.street}</p>
                        <p>
                          {selectedClaim.incidentDetails.location.postalCode}{" "}
                          {selectedClaim.incidentDetails.location.city}
                        </p>
                        <p>{selectedClaim.incidentDetails.location.country}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedClaim.incidentDetails.thirdPartyInvolved && (
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Third Party Involved
                        </h3>
                        <div className="space-y-2">
                          <p>
                            <strong>Name:</strong>{" "}
                            {
                              selectedClaim.incidentDetails.thirdPartyDetails
                                .name
                            }
                          </p>
                          <p>
                            <strong>Contact:</strong>{" "}
                            {
                              selectedClaim.incidentDetails.thirdPartyDetails
                                .contactInfo
                            }
                          </p>
                          <p>
                            <strong>Insurance:</strong>{" "}
                            {
                              selectedClaim.incidentDetails.thirdPartyDetails
                                .insuranceInfo
                            }
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right Column - Description & Documents */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Incident Description
                      </h3>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedClaim.incidentDetails.description}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documents ({selectedClaim.documents.length})
                      </h3>
                      <div className="space-y-2">
                        {selectedClaim.documents.map((doc) => (
                          <div
                            key={doc.storageId}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="font-medium text-sm">
                                  {doc.originalFileName}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                  {doc.documentType
                                    .toLowerCase()
                                    .replace(/_/g, " ")}
                                </p>
                              </div>
                            </div>
                            {doc.fileUrl ? (
                              <button
                                className="btn outline  "
                                disabled={activeKey === doc.fileKey}
                                onClick={() =>
                                  handleDownload(
                                    doc.fileKey,
                                    doc.originalFileName
                                  )
                                }
                              >
                                {activeKey === doc.fileKey
                                  ? "Preparing..."
                                  : "Download"}
                              </button>
                            ) : (
                              <span>No file uploaded</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Claim Amount
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(
                          selectedClaim.amount as number | undefined
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-2 space-x-3 mt-5 ">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button className="btn btn-primary">Process Claim</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*  Edit Claim Modal*/}
      {isEditModalOpen && selectedClaim && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Claim: {selectedClaim.claimNumber}
                  </h2>
                  <p className="text-gray-600">
                    Policy: {selectedClaim.policyNumber}
                  </p>
                </div>
                <div className="flex gap-2">
                  {getClaimTypeBadge(selectedClaim.claimType)}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="">
                  <Card className="mb-2">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Claim Status & Amount
                      </h3>
                      <div className="">
                        <div className="pb-3 w-full">
                          <label className="text-sm font-medium text-gray-500 block">
                            Status
                          </label>
                          <Select
                            value={editForm.status}
                            onValueChange={(value) =>
                              handleInputChange("status", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem className="px-2 py-2" value="PENDING">
                                Pending
                              </SelectItem>
                              <SelectItem
                                className="px-2 py-2"
                                value="APPROVED"
                              >
                                Approved
                              </SelectItem>
                              <SelectItem
                                className="px-2 py-2"
                                value="REJECTED"
                              >
                                Rejected
                              </SelectItem>
                              <SelectItem
                                className="px-2 py-2"
                                value="UNDER_REVIEW"
                              >
                                Under Review
                              </SelectItem>
                              <SelectItem
                                className="px-2 py-2"
                                value="PROCESSING"
                              >
                                Processing
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="pb-3">
                          <label className="text-sm font-medium text-gray-500  block">
                            Claim Amount ($)
                          </label>
                          <Input
                            type="number"
                            value={editForm.amount || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "amount",
                                e.target.value ? Number(e.target.value) : null
                              )
                            }
                            placeholder="Enter claim amount"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 mb-2 block">
                            Police Report Number
                          </label>
                          <Input
                            value={editForm.incidentDetails.policeReportNumber}
                            onChange={(e) =>
                              handleInputChange(
                                "incidentDetails.policeReportNumber",
                                e.target.value
                              )
                            }
                            placeholder="Enter police report number"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Location Details
                      </h3>
                      <div className="space-y-3">
                        <div className="pb-3">
                          <label className="text-sm font-medium text-gray-500">
                            Street
                          </label>
                          <Input
                            value={editForm.incidentDetails.location.street}
                            onChange={(e) =>
                              handleInputChange(
                                "incidentDetails.location.street",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="pb-3">
                            <label className="text-sm font-medium text-gray-500">
                              City
                            </label>
                            <Input
                              value={editForm.incidentDetails.location.city}
                              onChange={(e) =>
                                handleInputChange(
                                  "incidentDetails.location.city",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Postal Code
                            </label>
                            <Input
                              value={
                                editForm.incidentDetails.location.postalCode
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "incidentDetails.location.postalCode",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Country
                          </label>
                          <Input
                            value={editForm.incidentDetails.location.country}
                            onChange={(e) =>
                              handleInputChange(
                                "incidentDetails.location.country",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Description & Third Party */}
                <div className="space-y-6">
                  <Card className="mb-2">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">
                        Incident Description:
                      </h3>
                      <Textarea
                        value={editForm.incidentDetails.description}
                        onChange={(e) =>
                          handleInputChange(
                            "incidentDetails.description",
                            e.target.value
                          )
                        }
                        rows={6}
                        placeholder="Enter incident description..."
                      />
                    </CardContent>
                  </Card>

                  {selectedClaim.incidentDetails.thirdPartyInvolved && (
                    <Card className="">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Third Party Details
                        </h3>
                        <div className="">
                          <div className="pb-3">
                            <label className="text-sm font-medium text-gray-500">
                              Name
                            </label>
                            <Input
                              value={
                                editForm.incidentDetails.thirdPartyDetails.name
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "incidentDetails.thirdPartyDetails.name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="pb-3">
                            <label className="text-sm font-medium text-gray-500">
                              Contact Info
                            </label>
                            <Input
                              value={
                                editForm.incidentDetails.thirdPartyDetails
                                  .contactInfo
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "incidentDetails.thirdPartyDetails.contactInfo",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Insurance Info
                            </label>
                            <Input
                              value={
                                editForm.incidentDetails.thirdPartyDetails
                                  .insuranceInfo
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "incidentDetails.thirdPartyDetails.insuranceInfo",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 space-x-3 mt-5">
                <Button
                  className="rounded"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditForm(null);
                  }}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="text-white rounded "
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllClaims;
