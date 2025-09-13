import { useLocation, useParams, Link as RouterLink } from "react-router-dom";
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

export default function ClaimDetailsPage() {
  const { claimNumber } = useParams<{ claimNumber: string }>();
  const location = useLocation() as { state?: { claim?: any } };
  const fastClaim = location.state?.claim; // comes from Link state if available

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

  const statusToBadge = (status?: string) => {
    if (!status) return "";
    const s = status.toUpperCase();
    if (s === "APPROVED") return "bg-green-100 text-green-800";
    if (s === "PENDING") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (!claim && isFetching) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <Card>
          <CardContent className="py-10 text-center">
            Loading claim…
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="max-w-5xl mx-auto p-4 space-y-4">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="mb-4">Claim not found.</p>
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
    <div className="max-w-5xl mx-auto p-4 bg-  ">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" className="mb-3  ">
          <RouterLink to="/my-page">
            <span>←</span>
            <span>Back</span>
          </RouterLink>
        </Button>
        <div className="text-sm text-muted-foreground">
          Claim #{claim.claimNumber}
        </div>
      </div>

      <Card className="shadow p-4">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{claim.claimType}</CardTitle>
              <div className="text-sm text-muted-foreground">
                Policy:{" "}
                <span className="font-medium">{claim.policyNumber}</span>
              </div>
            </div>
            <Badge className={`${statusToBadge(claim.status)} p-1`}>
              {claim.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg border p-4">
              <div className="text-xs text-muted-foreground">Filed On</div>
              <div className="mt-1 font-medium">
                {formatDateTime(incidentDetails?.incidentDateTime)}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-xs text-muted-foreground">Amount</div>
              <div className="mt-1 font-medium">
                {claim.amount || "Pending"}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="mt-1">
                <Badge className={`${statusToBadge(claim.status)} p-1`}>
                  {claim.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Incident details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border py-4 px-3 gap-3">
              <CardHeader>
                <CardTitle className="text-lg">Incident</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Type</div>
                  <div className="font-medium">{incidentDetails?.type}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Date & Time
                  </div>
                  <div className="font-medium">
                    {formatDateTime(incidentDetails?.incidentDateTime)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Location</div>
                  <div className="font-medium">
                    {incidentDetails?.location?.street}
                    <br />
                    {incidentDetails?.location?.postalCode}{" "}
                    {incidentDetails?.location?.city}
                    <br />
                    {incidentDetails?.location?.country}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Description
                  </div>
                  <div className="text-sm">{incidentDetails?.description}</div>
                </div>
                {incidentDetails?.policeReportNumber && (
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Police Report #
                    </div>
                    <div className="font-medium">
                      {incidentDetails.policeReportNumber}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border py-4 px-3">
              <CardHeader>
                <CardTitle className="text-lg">Third Party</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Involved</div>
                  <div className="font-medium">
                    {incidentDetails?.thirdPartyInvolved ? "Yes" : "No"}
                  </div>
                </div>
                {incidentDetails?.thirdPartyInvolved && (
                  <>
                    <div>
                      <div className="text-xs text-muted-foreground">Name</div>
                      <div className="font-medium">
                        {incidentDetails?.thirdPartyDetails?.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Contact
                      </div>
                      <div className="font-medium">
                        {incidentDetails?.thirdPartyDetails?.contactInfo}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Insurance
                      </div>
                      <div className="font-medium">
                        {incidentDetails?.thirdPartyDetails?.insuranceInfo}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator className="my-4" />

          {/* Documents */}
          <Card className="border px-3 py-4">
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {!documents || documents.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No documents uploaded yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Checksum (SHA-256)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc: any) => (
                      <TableRow key={doc.storageId}>
                        <TableCell className="font-medium">
                          {doc.documentType}
                        </TableCell>
                        <TableCell>{doc.originalFileName}</TableCell>
                        <TableCell className="text-xs break-all">
                          {doc.sha256Checksum}
                        </TableCell>
                        <TableCell>
                          {doc.fileUrl ? (
                            <Button asChild variant="outline" size="sm">
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download
                              </a>
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No file URL
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
        </CardContent>
      </Card>
    </div>
  );
}
