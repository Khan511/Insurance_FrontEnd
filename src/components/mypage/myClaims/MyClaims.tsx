import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
import { useGetAllClaimsOfUserQuery } from "@/services/ClaimMetaDataApi";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { Spinner } from "react-bootstrap";
// import { useState } from "react";

// import ClaimDetails from "./ClaimDetails";

// import type { ClaimApiResponse } from "@/pages/claim/Types";
import { Link } from "react-router";

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
    month: "long",
    day: "numeric",
  });
  const time = dt.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} ${time}`;
}

// export type Claims = {
//   id: number;
//   number: string;
//   type: string;
//   status: string;
//   amount: string;
//   date: string;
// };

// interface Props {
//   claims: Claims[];
// }

export default function MyClaims() {
  // const [selectedClaim, setSelectedClaim] = useState<ClaimApiResponse | null>(
  //   null
  // );

  const { data: currentUser } = useGetCurrenttUserQuery();

  const userId = currentUser?.data.user.userId;

  const { data: claims, isLoading } = useGetAllClaimsOfUserQuery(userId || "", {
    skip: !userId,
  });

  console.log("My Claims: ", claims);

  if (isLoading)
    return (
      <div className=" flex justify-center items-center ext-center mt-5 mx-auto">
        <Spinner />
      </div>
    );
  return (
    <TabsContent value="claims" className="mt-3 mb-5">
      <Card className=" ">
        <CardHeader className="pt-4 text-center text-2xl text-blue-500">
          <CardTitle>Insurance Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {claims &&
              claims.claim.map((cla) => (
                <div
                  key={cla.claimNumber}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h3 className="font-semibold">{cla.claimType}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Claim #: {cla.claimNumber}
                      </p>
                    </div>

                    <div className="mt-3 sm:mt-0">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          cla.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : cla.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {cla.status}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        Filed:{" "}
                        {formatDateTime(cla.incidentDetails.incidentDateTime)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-between items-center">
                    <p className="font-medium">
                      Amount:{" "}
                      <span className=" text-yellow-700">
                        {" "}
                        {cla.amount || "Pending"}
                      </span>
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Link
                        className="btn btn-primary"
                        to={`/my-claims/${cla.claimNumber}`}
                        state={{ claim: cla }}
                      >
                        View Details
                      </Link>
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedClaim(cla)}
                      >
                        View Details
                      </Button> */}
                    </div>
                  </div>
                </div>
              ))}
            {/* {selectedClaim && (
              <ClaimDetails
                claim={selectedClaim}
                onBack={() => setSelectedClaim(null)}
              />
            )} */}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
