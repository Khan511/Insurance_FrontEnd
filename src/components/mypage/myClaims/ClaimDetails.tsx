import {
  useLocation,
  useParams,
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllClaimsOfUserQuery } from "@/services/ClaimMetaDataApi";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { useFileDownload } from "./useFileDownlaod";
import {
  Calendar,
  MapPin,
  FileText,
  DollarSign,
  Shield,
  User,
  Clock,
  AlertCircle,
  Building,
  FileCheck,
} from "lucide-react";

type DateTuple = [number, number, number, number?, number?];

function toDate(value?: DateTuple | string) {
  if (!value) return null;
  if (Array.isArray(value)) {
    const [y, m, d, h = 0, min = 0] = value;
    return new Date(y, m - 1, d, h, min);
  }
  const dt = new Date(value);
  return isNaN(dt.getTime()) ? null : dt;
}

function formatDateTime(value?: DateTuple | string, locale = "en-GB") {
  const dt = toDate(value);
  if (!dt) return "";
  const date = dt.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = dt.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} ${time}`;
}

// Helper to format currency
function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "Not specified";
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
  }).format(amount);
}

// Helper to make claim type user-friendly
function formatClaimType(claimType: string) {
  return claimType
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Enhanced status badge function
function statusToBadge(status?: string) {
  if (!status) return "bg-gray-100 text-gray-800";
  const s = status.toUpperCase();
  switch (s) {
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    case "UNDER_REVIEW":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "PAID":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "CLOSED":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "UNDER_INVESTIGATION":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

// Get status icon
function getStatusIcon(status?: string) {
  if (!status) return <AlertCircle className="h-4 w-4" />;
  const s = status.toUpperCase();
  switch (s) {
    case "APPROVED":
      return <FileCheck className="h-4 w-4" />;
    case "PENDING":
      return <Clock className="h-4 w-4" />;
    case "REJECTED":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}

export default function ClaimDetailsPage() {
  const navigate = useNavigate();
  const { downloadFile, activeKey } = useFileDownload();
  const { claimNumber } = useParams<{ claimNumber: string }>();
  const location = useLocation() as { state?: { claim?: any } };
  // comes from Link state if available
  const fastClaim = location.state?.claim;

  // Fallback: load all claims for current user and find by claimNumber (in case user refreshed page)
  const { data: currentUser } = useGetCurrenttUserQuery();
  const userId = currentUser?.data.user.userId;
  const { data: claimsResponse, isFetching } = useGetAllClaimsOfUserQuery(
    userId || "",
    {
      skip: !userId || !!fastClaim,
    }
  );

  const claim =
    fastClaim ||
    claimsResponse?.claim?.find((c: any) => c.claimNumber === claimNumber);

  if (!claim && isFetching) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Card>
          <CardContent className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading claim details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log("Claim in claimDetails: ", claim);

  if (!claim) {
    return (
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <Card>
          <CardContent className="py-10 text-center">
            <div className="mb-4">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-lg font-medium mb-2">Claim not found</p>
              <p className="text-gray-600 mb-6">
                The claim you're looking for doesn't exist or you don't have
                access to it.
              </p>
            </div>
            <Button asChild variant="outline">
              <RouterLink to="/my-page">Back to My Page</RouterLink>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { incidentDetails, documents } = claim;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <span className="mr-2">←</span>
          Back to My Claims
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="h-4 w-4" />
          <span className="font-mono">Claim #{claim.claimNumber}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Timeline Card */}
          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">
                  Claim Status & Timeline
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Current Status</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={`${statusToBadge(
                        claim.status
                      )} flex items-center gap-1`}
                    >
                      {getStatusIcon(claim.status)}
                      {claim.status}
                    </Badge>
                    {claim.isActive && (
                      <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-50 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Processing Time</div>
                  <div
                    className={`font-medium ${
                      claim.processingDays > 14
                        ? "text-red-600"
                        : claim.processingDays > 7
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {claim.processingDays} days
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div>
                      <div className="text-sm font-medium">Incident Date</div>
                      <div className="text-xs text-gray-500">
                        When the incident occurred
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatDateTime(incidentDetails?.incidentDateTime)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div>
                      <div className="text-sm font-medium">Submitted</div>
                      <div className="text-xs text-gray-500">
                        When you filed the claim
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatDateTime(claim.submissionDate)}
                    </div>
                  </div>
                </div>

                {claim.approvedDate && claim.status === "APPROVED" && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <div>
                        <div className="text-sm font-medium">Approved</div>
                        <div className="text-xs text-gray-500">
                          When claim was approved
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {formatDateTime(claim.approvedDate)}
                      </div>
                    </div>
                  </div>
                )}

                {claim.rejectedDate && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div>
                        <div className="text-sm font-medium">Rejected</div>
                        <div className="text-xs text-gray-500">
                          When claim was rejected
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">
                        {formatDateTime(claim.rejectedDate)}
                      </div>
                    </div>
                  </div>
                )}

                {claim.paidDate && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <div>
                        <div className="text-sm font-medium">Paid</div>
                        <div className="text-xs text-gray-500">
                          When payment was made
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-600">
                        {formatDateTime(claim.paidDate)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Incident Details Card */}
          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Incident Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Incident Type</div>
                  <div className="font-medium mt-1">
                    {formatClaimType(incidentDetails?.type || claim.claimType)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date & Time</div>
                  <div className="font-medium mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDateTime(incidentDetails?.incidentDateTime)}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                  <div className="font-medium">
                    {incidentDetails?.location?.street}
                  </div>
                  <div>
                    {incidentDetails?.location?.postalCode}{" "}
                    {incidentDetails?.location?.city}
                  </div>
                  <div className="text-sm text-gray-600">
                    {incidentDetails?.location?.country}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-2">Description</div>
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                  {incidentDetails?.description}
                </div>
              </div>

              {incidentDetails?.policeReportNumber && (
                <div>
                  <div className="text-sm text-gray-500">
                    Police Report Number
                  </div>
                  <div className="font-medium mt-1 font-mono">
                    {incidentDetails.policeReportNumber}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Third Party Information Card */}
          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">
                  Third Party Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">
                      Third Party Involved
                    </div>
                    <div className="font-medium mt-1">
                      {incidentDetails?.thirdPartyInvolved ? "Yes" : "No"}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      incidentDetails?.thirdPartyInvolved
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-50 text-gray-700"
                    }
                  >
                    {incidentDetails?.thirdPartyInvolved
                      ? "Third Party Involved"
                      : "No Third Party"}
                  </Badge>
                </div>

                {incidentDetails?.thirdPartyInvolved && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Name</div>
                        <div className="font-medium mt-1">
                          {incidentDetails?.thirdPartyDetails?.name}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Contact Info
                        </div>
                        <div className="font-medium mt-1">
                          {incidentDetails?.thirdPartyDetails?.contactInfo}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        Insurance Information
                      </div>
                      <div className="font-medium mt-1">
                        {incidentDetails?.thirdPartyDetails?.insuranceInfo}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg">
                  Documents ({documents?.length || 0})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {!documents || documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No documents uploaded yet.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Documents will appear here once uploaded
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc: any) => (
                      <TableRow key={doc.storageId}>
                        <TableCell className="font-medium">
                          <Badge variant="outline" className="text-xs">
                            {doc.documentType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">
                            {doc.originalFileName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {doc.uploadedAt
                              ? formatDateTime(doc.uploadedAt)
                              : "—"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {doc.fileUrl ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={activeKey === doc.fileKey}
                              onClick={() =>
                                downloadFile(doc.fileKey, doc.originalFileName)
                              }
                              className="w-32"
                            >
                              {activeKey === doc.fileKey ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                                  Preparing...
                                </>
                              ) : (
                                <>
                                  <FileText className="h-3 w-3 mr-2" />
                                  Download
                                </>
                              )}
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-400">
                              File unavailable
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Financial Information Card */}
          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Financial Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Claimed Amount</div>
                  <div className="text-2xl font-bold mt-1">
                    {formatCurrency(claim.amount)}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-gray-500">Approved Amount</div>
                  <div
                    className={`text-2xl font-bold mt-1 ${
                      claim.approvedAmount ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {claim.approvedAmount
                      ? formatCurrency(claim.approvedAmount)
                      : claim.status === "REJECTED"
                      ? "Claim Rejected"
                      : "Pending approval"}
                  </div>
                  {claim.approvedAmount &&
                    claim.approvedAmount !== claim.amount && (
                      <div className="text-sm text-yellow-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Amount differs from claimed
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Information Card */}
          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Shield className="h-5 w-5 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Policy Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Policy Number</div>
                <div className="font-medium text-lg font-mono mt-1">
                  {claim.policyNumber}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Insurance Product</div>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{claim.productName}</div>
                    <div className="text-sm text-gray-500">
                      {claim.productCode}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Claim Type</div>
                <div className="font-medium mt-1">
                  {formatClaimType(claim.claimType)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Information Card */}
          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <FileCheck className="h-5 w-5 text-amber-600" />
                </div>
                <CardTitle className="text-lg">
                  Processing Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {claim.processedBy && (
                <div>
                  <div className="text-sm text-gray-500">Processed By</div>
                  <div className="font-medium mt-1">{claim.processedBy}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Insurance administrator
                  </div>
                </div>
              )}
              {claim.rejectionReason && (
                <div>
                  <div className="text-sm text-gray-500">Rejection Reason</div>
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm">
                    {claim.rejectionReason}
                  </div>
                </div>
              )}
              {!claim.processedBy && !claim.rejectionReason && (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Awaiting processing</p>
                  <p
                    className={
                      claim.status === "APPROVED" // ✅ Proper boolean check
                        ? "text-green-500 font-semibold"
                        : "text-sm text-gray-400 mt-1"
                    }
                  >
                    {/* Your claim is in queue for review */}
                    Your claim is {claim.status}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information Card */}
          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-50 rounded-lg">
                  <User className="h-5 w-5 text-cyan-600" />
                </div>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium">{claim.customerName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-sm">
                    {claim.customerEmail}
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-xs text-gray-500">
                    Claim Reference ID:{" "}
                    <span className="font-mono">{claim.claimNumber}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <RouterLink to="/my-page/claims">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Claims
                </RouterLink>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <RouterLink to={`/all-products`}>
                  <User className="h-4 w-4 mr-2" />
                  Contact Support
                </RouterLink>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                {/* <RouterLink
                  to={`/my-page/policies/${claim.policyNumber}/policiy-details`}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  View Policy Details
                </RouterLink> */}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Status Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                claim.status === "APPROVED"
                  ? "bg-green-500"
                  : claim.status === "REJECTED"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            ></div>
            <div>
              <div className="font-medium">Claim Status Summary</div>
              <div className="text-sm text-gray-600">
                {claim.status === "PENDING" &&
                  "Your claim is awaiting review by our team"}
                {claim.status === "APPROVED" &&
                  "Your claim has been approved and is being processed for payment"}
                {claim.status === "PAID" && "Your claim has been paid"}
                {claim.status === "REJECTED" &&
                  "Your claim has been rejected. Please contact support for more information"}
                {claim.status === "UNDER_REVIEW" &&
                  "Your claim is currently under review by our specialists"}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <RouterLink to="/contact">Need Help?</RouterLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
