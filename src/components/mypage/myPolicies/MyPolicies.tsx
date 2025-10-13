import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Link } from "react-router";
import { useGetAllPoliciesOfUserQuery } from "@/services/InsurancePolicySlice";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { Spinner } from "react-bootstrap";

type DateTuple = [number, number, number, number?, number?];

function formatDate(dateInput: string | DateTuple, locale = "en-GB"): string {
  let date: Date;

  if (typeof dateInput === "string") {
    date = new Date(dateInput);
  } else {
    // Handle DateTuple case
    const [y, m, d, h = 0, min = 0] = dateInput;
    date = new Date(y, m - 1, d, h, min);
  }

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function MyPolicies() {
  const { data: currentUser } = useGetCurrenttUserQuery();
  const userId = currentUser?.data?.user?.userId;
  const { data: myAllPolicies, isLoading } = useGetAllPoliciesOfUserQuery(
    userId || "",
    {
      skip: !userId,
    }
  );

  if (isLoading)
    return (
      <div className=" flex justify-center items-center ext-center mt-5 mx-auto">
        <Spinner />
      </div>
    );

  return (
    <TabsContent value="policies" className="mt-3 mb-5">
      <Card className="">
        <CardHeader className="pt-4 text-center text-2xl text-blue-500">
          <CardTitle>Insurance Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {myAllPolicies?.map((policy) => (
              <div
                key={policy.id}
                className=" flex justify-between items-center border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-co">
                    <div className="flex  ">
                      <h3 className="font-semibold">
                        {policy.policyNumber.split("-")[0]} insurance
                      </h3>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          policy.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-gray-800"
                        }`}
                      >
                        {policy.status.toLocaleLowerCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {/* Policy #: {policy.number} */}
                    </p>

                    <div className="mt-3 sm:mt-0 text-right">
                      {/* <p className="font-medium">{policy.premium}/mo</p> */}
                      <p className="text-sm text-gray-600 flex gap-1 justify-start items-center">
                        <span>Started:</span>{" "}
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(policy.validityPeriod.effectiveDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Link
                    to={`/my-page/policy/${policy.id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                  {/* <Link to="" className="btn btn-secondary  ">
                    Make Payment
                  </Link> */}
                  {/* <Link to="#" className="btn btn-secondary">
                    File Claim
                  </Link> */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
