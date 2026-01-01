import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useGetAllClaimsOfUserQuery } from "@/services/ClaimMetaDataApi";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  DollarSign,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

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

export function formatDateTime(value?: DateTuple | string, locale = "en-GB") {
  const dt = toDate(value);
  if (!dt) return "";
  const date = dt.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const time = dt.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} ${time}`;
}

function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "Not specified";
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
  }).format(amount);
}

function formatClaimType(claimType: string) {
  return claimType
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusBadge(status: string) {
  const statusConfig = {
    PENDING: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <Clock className="h-3 w-3 mr-1" />,
      label: "Pending",
    },

    APPROVED: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
      label: "Approved",
    },
    REJECTED: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <XCircle className="h-3 w-3 mr-1" />,
      label: "Rejected",
    },
    UNDER_REVIEW: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <Eye className="h-3 w-3 mr-1" />,
      label: "Under Review",
    },
    UNDER_INVESTIGATION: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
      label: "Investigation",
    },
    PAID: {
      color: "bg-green-200 text-emerald-800 border-emerald-200",
      icon: <DollarSign className="h-3 w-3 mr-1" />,
      label: "Paid",
    },
    CLOSED: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
      label: "Closed",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  return (
    <Badge
      variant="outline"
      className={`${config.color} flex items-center px-2 py-1 text-xs`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}

function getClaimTypeIcon(claimType: string) {
  const typeConfig = {
    HEALTH_HOSPITALIZATION: "🏥",
    HOME_DAMAGE: "🏠",
    FIRE: "🔥",
    THEFT: "👮",
    WATER_DAMAGE: "💧",
    AUTOMOBILE_COLLISION: "🚗",
    MEDICAL_EMERGENCY: "🚑",
  };
  return typeConfig[claimType as keyof typeof typeConfig] || "📄";
}

export default function MyClaims() {
  const { data: currentUser } = useGetCurrenttUserQuery();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const userId = currentUser?.data.user.userId;
  const { data: claimsResponse, isLoading } = useGetAllClaimsOfUserQuery(
    userId || "",
    {
      skip: !userId,
    }
  );

  const claims = claimsResponse?.claim || [];

  // Filter claims based on selected status
  const filteredClaims = claims.filter((claim) => {
    if (statusFilter === "ALL") return true;
    return claim.status === statusFilter;
  });

  // Calculate statistics
  const stats = {
    total: claims.length,
    pending: claims.filter((c) => c.status === "PENDING").length,
    under_review: claims.filter((c) => c.status === "UNDER_REVIEW").length,
    approved: claims.filter((c) => c.status === "APPROVED").length,
    paid: claims.filter((c) => c.status === "PAID").length,
    rejected: claims.filter((c) => c.status === "REJECTED").length,
  };

  console.log("Claims in myClaims", claims);
  console.log("Status in myClaims", stats);

  if (isLoading) {
    return (
      <TabsContent value="claims" className="mt-3 mb-5">
        <Card className="border">
          <CardContent className="py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your claims...</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="claims" className="mt-3 mb-5">
      <Card className="border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Insurance Claims
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage and track your insurance claims
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PAID">Paid</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-gray-600">Total Claims</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <div className="text-2xl font-bold">{stats.under_review}</div>
              <div className="text-xs text-gray-600">Under_Review</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl font-bold">{stats.approved}</div>
              <div className="text-xs text-gray-600">Approved</div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <div className="text-2xl font-bold">{stats.paid}</div>
              <div className="text-xs text-gray-600">Paid</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-2xl font-bold">{stats.rejected}</div>
              <div className="text-xs text-gray-600">Rejected</div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredClaims.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No claims found</p>
              {statusFilter !== "ALL" && (
                <p className="text-sm text-gray-400 mt-1">
                  Try changing your status filter
                </p>
              )}
              {claims.length === 0 && (
                <p className="text-sm text-gray-400 mt-1">
                  You haven't filed any claims yet
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClaims.map((claim) => (
                <div
                  key={claim.claimNumber}
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-200 bg-white"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Left Column - Claim Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">
                          {getClaimTypeIcon(claim.claimType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {formatClaimType(claim.claimType)}
                            </h3>
                            {getStatusBadge(claim.status)}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-2">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span className="font-mono">
                                {claim.claimNumber}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              <span>Policy: {claim.policyNumber}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Filed: {formatDateTime(claim.submissionDate)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-gray-500">
                                Incident Date
                              </div>
                              <div className="font-medium text-sm">
                                {formatDateTime(
                                  claim.incidentDetails?.incidentDateTime
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">
                                Processing Time
                              </div>
                              <div
                                className={`font-medium text-sm ${
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
                        </div>
                      </div>

                      {/* Incident Summary */}
                      {claim.incidentDetails?.description && (
                        <div className="mt-3">
                          <div className="text-xs text-gray-500">
                            Incident Summary
                          </div>
                          <p className="text-sm line-clamp-2 mt-1">
                            {claim.incidentDetails.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Financial & Actions */}
                    <div className="md:w-48 space-y-4">
                      <div className="space-y-3">
                        {/* Claimed Amount */}
                        <div>
                          <div className="text-xs text-gray-500">
                            Claimed Amount
                          </div>
                          <div className="font-bold text-lg">
                            {formatCurrency(
                              Number(claim.incidentDetails.claimAmount)
                            )}
                          </div>
                        </div>

                        {/* Approved Amount (if different) */}
                        {claim.approvedAmount &&
                          claim.approvedAmount !==
                            Number(claim.incidentDetails.claimAmount) && (
                            <div>
                              <div className="text-xs text-gray-500">
                                Approved Amount
                              </div>
                              <div className="font-bold text-lg text-green-600">
                                {formatCurrency(claim.approvedAmount)}
                              </div>
                            </div>
                          )}

                        {/* Processing Indicator */}
                        <div className="pt-2 border-t">
                          <div className="text-xs text-gray-500">Progress</div>
                          <div className="mt-1">
                            {claim.status === "PENDING" && (
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-yellow-500 rounded-full"
                                    style={{ width: "25%" }}
                                  ></div>
                                </div>
                                <span className="text-xs">25%</span>
                              </div>
                            )}
                            {claim.status === "UNDER_REVIEW" && (
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: "50%" }}
                                  ></div>
                                </div>
                                <span className="text-xs">50%</span>
                              </div>
                            )}
                            {claim.status === "APPROVED" && (
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: "75%" }}
                                  ></div>
                                </div>
                                <span className="text-xs">75%</span>
                              </div>
                            )}
                            {claim.status === "PAID" && (
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: "100%" }}
                                  ></div>
                                </div>
                                <span className="text-xs">100%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        <Button
                          asChild
                          className="w-full"
                          size="sm"
                          variant="outline"
                        >
                          <Link
                            to={`/my-claims/${claim.claimNumber}/claim-details`}
                            state={{ claim }}
                            className="flex items-center justify-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Status Info */}
                  <div className="mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm">
                      {claim.status === "PENDING" && (
                        <span className="text-yellow-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Awaiting review
                        </span>
                      )}
                      {claim.status === "APPROVED" && (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Approved - Payment pending
                        </span>
                      )}
                      {claim.status === "PAID" && (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Payment completed
                        </span>
                      )}
                      {claim.status === "REJECTED" && (
                        <span className="text-red-600 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Claim rejected
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      Last updated: {formatDateTime(claim.submissionDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State or Filter Results */}
          {claims.length > 0 &&
            filteredClaims.length === 0 &&
            statusFilter !== "ALL" && (
              <div className="text-center py-8 border-t">
                <Filter className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">
                  No {statusFilter.toLowerCase()} claims found
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setStatusFilter("ALL")}
                >
                  Show All Claims
                </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
