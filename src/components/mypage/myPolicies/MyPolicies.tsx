import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../../ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router";

// export type Policy = {
//   id: number;
//   number: string;
//   type: string;
//   status: string;
//   premium: string;
//   renewal: string;
// };

export type MonetaryAmount = {
  amount: number;
  currency: string;
};

export type CoverageDetails = {
  coverageType: string;
  description: string;
  coverageLimit: MonetaryAmount;
  deductible: MonetaryAmount;
};

export type ProductType =
  | "AUTO"
  | "HEALTH"
  | "LIFE"
  | "PROPERTY"
  | "TRAVEL"
  | "LIABILITY"
  | "PET";

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type PolicyPeriod = {
  effectiveDate: string;
  expirationDate: string;
};

export type ProductTranslation = {
  displayName: string;
  description: string;
};

export type AgeBracket = {
  minAge?: number;
  maxAge?: number;
  multiplier?: number;
  factor?: number;
};

export type PremiumCalculationConfig = {
  formula?: string;
  factors?: Record<string, number>;
  basePremium?: MonetaryAmount;
  ageBrackets?: AgeBracket[];
  includeTax?: boolean;
  commissionRate?: number;
};

export type InsuraceProduct = {
  id: number;
  productCode: string;
  policyNumber: string;
  displayName: string;
  status: string;
  description: string;
  productType: ProductType;
  coverageDetails: CoverageDetails[];
  eligibilityRules: { [key: string]: string };
  targetAudience: string[];
  regions: string[];
  category: Category;
  validityPeriod: PolicyPeriod;
  allowedClaimTypes: string[];
  translation: { [locale: string]: ProductTranslation };
  calculationConfig?: PremiumCalculationConfig;
};

interface Props {
  policies: InsuraceProduct[];
}

export default function MyPolicies({ policies }: Props) {
  return (
    <TabsContent value="policies" className="mt-3 mb-5">
      <Card className="">
        <CardHeader className="pt-4 text-center text-2xl text-blue-500">
          <CardTitle>Insurance Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <div className="flex justify-center items-center">
                      <h3 className="font-semibold">
                        {policy.policyNumber.split("-")[0]} Insurance
                      </h3>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          policy.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {policy.status.toLocaleLowerCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {/* Policy #: {policy.number} */}
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-0 text-right">
                    {/* <p className="font-medium">{policy.premium}/mo</p> */}
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {/* Renewal: {policy.renewal} */}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Link
                    to={`/my-page/policy/${policy.id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                  <Link to="" className="btn btn-secondary  ">
                    Make Payment
                  </Link>
                  {/* <Button variant="outline" size="sm">
                    File Claim
                  </Button> */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
