import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  DollarSign,
  FileText,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  Building,
  FileCheck,
  FileX,
  AlertTriangle,
  History,
  Download,
  Eye,
  Building2,
  UserCircle,
  Mail,
  Home,
} from "lucide-react";
import { useFileDownload } from "@/components/mypage/myClaims/useFileDownlaod";
import { useGetClaimDetailsQuery } from "@/services/AdminSlice";
import { formatDate } from "@/utils/Utils";

export default function AdminClaimDetails() {
  const navigate = useNavigate();
  const { claimId } = useParams();
  const { downloadFile, activeKey } = useFileDownload();

  const { data: claimDetails, isLoading } = useGetClaimDetailsQuery(
    Number(claimId),
    {
      skip: !claimId,
    }
  );

  console.log("ClaimDetails: ", claimDetails);

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "Not specified";
    return new Intl.NumberFormat("da-DK", {
      style: "currency",
      currency: "DKK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
        icon: <Clock className="h-3 w-3 mr-1" />,
      },
      APPROVED: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Approved",
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
      },
      REJECTED: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Rejected",
        icon: <XCircle className="h-3 w-3 mr-1" />,
      },
      UNDER_REVIEW: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Under Review",
        icon: <Eye className="h-3 w-3 mr-1" />,
      },
      PAUSED: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Paused",
        icon: <AlertCircle className="h-3 w-3 mr-1" />,
      },
      PAID: {
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        label: "Paid",
        icon: <DollarSign className="h-3 w-3 mr-1" />,
      },
      CLOSED: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Closed",
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
      },
      WITHDRAWN: {
        color: "bg-slate-100 text-slate-800 border-slate-200",
        label: "Withdrawn",
        icon: <FileX className="h-3 w-3 mr-1" />,
      },
      CANCELLED: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        label: "Cancelled",
        icon: <XCircle className="h-3 w-3 mr-1" />,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <Badge
        variant="outline"
        className={`${config.color} flex items-center px-2 py-1`}
      >
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getClaimTypeBadge = (claimType: string) => {
    const typeConfig = {
      HOME_DAMAGE: {
        color: "bg-orange-100 text-orange-800",
        label: "Home Damage",
      },
      FIRE: {
        color: "bg-red-100 text-red-800",
        label: "Fire",
      },
      THEFT: {
        color: "bg-gray-100 text-gray-800",
        label: "Theft",
      },
      WATER_DAMAGE: {
        color: "bg-cyan-100 text-cyan-800",
        label: "Water Damage",
      },
      AUTOMOBILE_COLLISION: {
        color: "bg-blue-100 text-blue-800",
        label: "Auto Collision",
      },
      HEALTH_HOSPITALIZATION: {
        color: "bg-purple-100 text-purple-800",
        label: "Health",
      },
    };

    const config = typeConfig[claimType as keyof typeof typeConfig] || {
      color: "bg-gray-100 text-gray-800",
      label: claimType.replace(/_/g, " "),
    };

    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getProcessingTimeColor = (days: number | null) => {
    if (days === null) return "text-gray-500";
    if (days <= 7) return "text-green-600";
    if (days <= 14) return "text-yellow-600";
    return "text-red-600";
  };

  const handleDownload = (fileKey: string | null, fileName: string) => {
    if (fileKey) {
      downloadFile(fileKey, fileName);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading claim details...</p>
        </div>
      </div>
    );
  }

  if (!claimDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Claim Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The claim you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8 mt-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2"
          >
            ← Back to Claims
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Claim Details
              </h1>
              <p className="text-gray-600 mt-1">
                Claim Number:{" "}
                <span className="font-semibold">
                  {claimDetails.claimNumber}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(claimDetails.status)}
              {getClaimTypeBadge(claimDetails.claimType)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Claim Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Claim Overview Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Claim Overview</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Claim Reference
                      </div>
                      <div className="font-mono font-bold text-lg">
                        {claimDetails.claimNumber}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Policy Information
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {claimDetails.policyNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          {claimDetails.productName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {claimDetails.productCode}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Submitted
                      </div>
                      <div className="font-medium">
                        {formatDate(claimDetails.submissionDate)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Customer Information
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {claimDetails.customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {claimDetails.customerEmail}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Processing Time
                      </div>
                      <div
                        className={`font-medium ${getProcessingTimeColor(
                          claimDetails.processingDays
                        )}`}
                      >
                        {claimDetails.processingDays !== null
                          ? `${claimDetails.processingDays} days`
                          : "Not started"}
                      </div>
                    </div>

                    {claimDetails.processedBy && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          Processed By
                        </div>
                        <div className="font-medium">
                          {claimDetails.processedBy}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Incident Details Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h2 className="text-xl font-semibold">Incident Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Incident Type
                      </div>
                      <div className="font-medium">
                        {claimDetails.incidentDetails.type.replace(/_/g, " ")}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Incident Date & Time
                      </div>
                      <div className="font-medium">
                        {formatDate(
                          claimDetails?.incidentDetails?.incidentDateTime
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Police Report Number
                      </div>
                      <div className="font-medium">
                        {claimDetails.incidentDetails.policeReportNumber ||
                          "Not provided"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-2">Location</div>
                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {claimDetails.incidentDetails.location.street}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span>
                          {claimDetails.incidentDetails.location.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-gray-500" />
                        <span>
                          {claimDetails.incidentDetails.location.postalCode},{" "}
                          {claimDetails.incidentDetails.location.country}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm text-gray-600 mb-2">
                    Incident Description
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {claimDetails.incidentDetails.description}
                    </p>
                  </div>
                </div>

                {claimDetails.incidentDetails.thirdPartyInvolved && (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Third Party Information
                    </h3>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Name</div>
                          <div className="font-medium">
                            {claimDetails.incidentDetails.thirdPartyDetails
                              ?.name || "Not provided"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Contact Information
                          </div>
                          <div className="font-medium">
                            {claimDetails.incidentDetails.thirdPartyDetails
                              ?.contactInfo || "Not provided"}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="text-sm text-gray-600 mb-1">
                            Insurance Information
                          </div>
                          <div className="font-medium">
                            {claimDetails.incidentDetails.thirdPartyDetails
                              ?.insuranceInfo || "Not provided"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Details Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-semibold">Financial Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">
                      Claimed Amount
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(claimDetails.incidentDetails.claimAmount)}
                    </div>
                  </div>

                  {claimDetails.approvedAmount && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">
                        Approved Amount
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {formatCurrency(claimDetails.approvedAmount)}
                      </div>
                      {claimDetails.approvedDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Approved on {formatDate(claimDetails.approvedDate)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">
                      Payment Status
                    </div>
                    <div className="text-lg font-bold capitalize">
                      {claimDetails.paymentStatus.replace(/_/g, " ")}
                    </div>
                    {claimDetails.paidDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Paid on {formatDate(claimDetails.paidDate)}
                      </div>
                    )}
                  </div>
                </div>

                {claimDetails.approvalNotes && (
                  <div className="mt-6 border-t pt-6">
                    <div className="text-sm text-gray-600 mb-2">
                      Approval Notes
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-gray-700">
                        {claimDetails.approvalNotes}
                      </p>
                    </div>
                  </div>
                )}

                {claimDetails.paymentNotes && (
                  <div className="mt-6">
                    <div className="text-sm text-gray-600 mb-2">
                      Payment Notes
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-gray-700">
                        {claimDetails.paymentNotes}
                      </p>
                      {claimDetails.paymentReference && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Reference: </span>
                          <span className="font-medium">
                            {claimDetails.paymentReference}
                          </span>
                        </div>
                      )}
                      {claimDetails.paidBy && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Paid By: </span>
                          <span className="font-medium">
                            {claimDetails.paidBy}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileCheck className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-semibold">
                    Supporting Documents
                  </h2>
                  <Badge variant="secondary" className="ml-2">
                    {claimDetails.documents.length} files
                  </Badge>
                </div>

                {claimDetails.documents.length > 0 ? (
                  <div className="space-y-4">
                    {claimDetails.documents.map((doc) => (
                      <div
                        key={doc?.fileKey}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {doc.originalFileName}
                            </div>
                            <div className="text-sm text-gray-500 capitalize">
                              {doc.documentType
                                .toLowerCase()
                                .replace(/_/g, " ")}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Uploaded: {formatDate(doc.uploadedAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {doc.fileUrl ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={activeKey === doc.fileKey}
                              onClick={() =>
                                handleDownload(
                                  doc.fileKey,
                                  doc.originalFileName
                                )
                              }
                              className="flex items-center gap-2"
                            >
                              {activeKey === doc.fileKey ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                  Preparing...
                                </>
                              ) : (
                                <>
                                  <Download className="h-3 w-3" />
                                  Download
                                </>
                              )}
                            </Button>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No file available
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No documents attached to this claim
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Side Info */}
          <div className="space-y-6">
            {/* Claim Status Timeline Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <History className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-semibold">Claim Timeline</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div>
                      <div className="font-medium">Submitted</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(claimDetails.submissionDate)}
                      </div>
                    </div>
                  </div>

                  {claimDetails.approvedDate && (
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium text-green-700">
                          Approved
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(claimDetails.approvedDate)}
                        </div>
                      </div>
                    </div>
                  )}

                  {claimDetails.rejectedDate && (
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <XCircle className="h-3 w-3 text-red-500" />
                      </div>
                      <div>
                        <div className="font-medium text-red-700">Rejected</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(claimDetails.rejectedDate)}
                        </div>
                      </div>
                    </div>
                  )}

                  {claimDetails.paidDate && (
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                        <DollarSign className="h-3 w-3 text-emerald-500" />
                      </div>
                      <div>
                        <div className="font-medium text-emerald-700">Paid</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(claimDetails.paidDate)}
                        </div>
                      </div>
                    </div>
                  )}

                  {claimDetails.closedDate && (
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        <Shield className="h-3 w-3 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Closed</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(claimDetails.closedDate)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Claim Status Details Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Claim Status</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Status</div>
                      <div className="font-medium">
                        {claimDetails.status.replace(/_/g, " ")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Type</div>
                      <div className="font-medium">
                        {claimDetails.claimType.replace(/_/g, " ")}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rejection Details Card */}
            {claimDetails.rejectionReason && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h2 className="text-xl font-semibold">Rejection Details</h2>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Rejection Reason
                      </div>
                      <div className="text-sm bg-red-50 p-3 rounded border border-red-200">
                        {claimDetails.rejectionReason}
                      </div>
                    </div>

                    {claimDetails.rejectedDate && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          Rejection Date
                        </div>
                        <div className="font-medium">
                          {formatDate(claimDetails.rejectedDate)}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Permissions Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h2 className="text-xl font-semibold">Available Actions</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Can Be Approved
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        claimDetails.canBeApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {claimDetails.canBeApproved ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Can Be Rejected
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        claimDetails.canBeRejected
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {claimDetails.canBeRejected ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Can Be Paid</span>
                    <Badge
                      variant="outline"
                      className={
                        claimDetails.canBePaid
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {claimDetails.canBePaid ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information Section */}
        {claimDetails.storageBucket && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-semibold">Storage Information</h2>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage Bucket:</span>
                  <span className="font-medium">
                    {claimDetails.storageBucket}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Documents:</span>
                  <span className="font-medium">
                    {claimDetails.documents.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
