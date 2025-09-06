import { useGetPolicyDetailsQuery } from "@/services/InsurancePolicySlice";
import { useParams } from "react-router";

// Define the TypeScript interfaces for the policy data
interface Category {
  id: number;
  name: string;
  description: string;
}

interface CoverageLimit {
  amount: number;
  currency: string;
}

interface CoverageDetail {
  coverageType: string;
  description: string;
  coverageLimit: CoverageLimit;
  deductible: null;
}

interface EligibilityRules {
  maxAge: string;
  healthCheck: string;
  minAge: string;
}

interface Translation {
  displayName: string;
  description: string;
}

interface Translations {
  da_DK: Translation;
  nb_NO: Translation;
  sv_SE: Translation;
}

interface ValidityPeriod {
  effectiveDate: [number, number, number];
  expirationDate: [number, number, number];
  active: boolean;
  expired: boolean;
}

interface PolicyDetails {
  allowedClaimTypes: string[];
  calculationConfig: null;
  category: Category;
  coverageDetails: CoverageDetail[];
  description: string;
  displayName: string;
  eligibilityRules: EligibilityRules;
  id: number;
  policyNumber: string;
  productCode: string;
  productType: string;
  regions: string[];
  status: string;
  targetAudience: string[];
  translations: Translations;
  validityPeriod: ValidityPeriod;
}

// Sample policy data based on the user's input.
const policyData: PolicyDetails = {
  allowedClaimTypes: ["DEATH_CERTIFICATE", "BENEFICIARY_DOCS"],
  calculationConfig: null,
  category: { id: 3, name: "Life", description: "Life insurance products" },
  coverageDetails: [
    {
      coverageType: "Death Benefit",
      description: "Primary coverage amount",
      coverageLimit: { amount: 500000, currency: "DKK" },
      deductible: null,
    },
    {
      coverageType: "Accidental Death",
      description: "Additional accidental coverage",
      coverageLimit: { amount: 25000, currency: "DKK" },
      deductible: null,
    },
  ],
  description:
    "Financial protection for your family with flexible term options",
  displayName: "Term Life Insurance",
  eligibilityRules: { maxAge: "65", healthCheck: "REQUIRED", minAge: "18" },
  id: 2,
  policyNumber: "LIFE-9876",
  productCode: "LIFE-2025",
  productType: "LIFE",
  regions: ["Denmark", "Swedan", "Norway"],
  status: "ACTIVE",
  targetAudience: ["Families", "Breadwinners"],
  translations: {
    da_DK: {
      displayName: "Tidsbegrænset Livsforsikring",
      description:
        "Finansiel beskyttelse til din familie med fleksible løbetidsmuligheder",
    },
    nb_NO: {
      displayName: "Tidsbegrenset Livsforsikring",
      description:
        "Finansielt beskyttelse for familien din med fleksible løpetidsalternativer",
    },
    sv_SE: {
      displayName: "Tidsbegränsad Livförsäkring",
      description:
        "Finansiellt skydd för din familj med flexibla försäkringsperioder",
    },
  },
  validityPeriod: {
    effectiveDate: [2025, 8, 25],
    expirationDate: [2026, 8, 25],
    active: true,
    expired: false,
  },
};

// Main App component to display the policy details
export default function MyPoliciesDetails() {
  const { policyId } = useParams();

  const { data: policyDetails } = useGetPolicyDetailsQuery(policyId || "", {
    skip: !policyId,
  });

  console.log("PolicyDetials: ", policyDetails);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Date not available";
    // const [year, month, day] = dateString;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  // const formatDate = (dateArray?: [number, number, number]): string => {
  //   if (!dateArray) return "Date not available";
  //   const [year, month, day] = dateArray;
  //   return new Date(year, month - 1, day).toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });
  // };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-500 bg-green-100";
      case "expired":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-2 px-4 sm:px-5  lg:px-8">
      {/* Tailwind CSS CDN script for styling */}

      <div className="max-w-4xl mx-auto  font-sans">
        {/* Header Section */}
        <div className="bg-white shadow-xl rounded-2xl p-4 my-4 sm:p-5 text-center border-t-8 border-indigo-500">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            {policyDetails?.displayName}
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            {policyDetails?.category.description}
          </p>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Policy Information Card */}
          <div className="bg-white shadow-xl rounded-2xl p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-indigo-500 mr-2">&#9432;</span> Policy
              Information
            </h2>
            <div className="flex flex-col gap-1.5 text-gray-600">
              {/* <div>
                <span className="font-semibold text-gray-700">
                  Policy Number:
                </span>{" "}
                {policyData.policyNumber}
              </div> */}
              <div>
                <span className="font-semibold text-gray-700">
                  Policy Type:
                </span>{" "}
                {policyDetails?.productCode}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Category:</span>{" "}
                {policyDetails?.category.name}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Status:</span>
                <span
                  className={`inline-block ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    policyDetails?.status || ""
                  )}`}
                >
                  {policyDetails?.status}
                </span>
              </div>
            </div>
          </div>

          {/* Validity Period Card */}
          <div className="bg-white shadow-xl rounded-2xl p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-indigo-500 mr-2">&#9200;</span> Validity
              Period
            </h2>
            <div className="flex flex-col gap-1.5 text-gray-600">
              <div>
                <span className="font-semibold text-gray-700">
                  Effective Date:
                </span>{" "}
                {formatDate(policyDetails?.validityPeriod?.effectiveDate)}
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Expiration Date:
                </span>{" "}
                {formatDate(policyDetails?.validityPeriod.expirationDate)}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Active:</span>{" "}
                {policyData.validityPeriod.active ? "Yes" : "No"}
              </div>
            </div>
          </div>

          {/* Eligibility Rules Card */}
          <div className="bg-white shadow-xl rounded-2xl p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-indigo-500 mr-2">&#10003;</span> Eligibility
              Rules
            </h2>
            <div className="flex flex-col gap-1.5 text-gray-600">
              <div>
                <span className="font-semibold text-gray-700">
                  Minimum Age:
                </span>{" "}
                {policyData.eligibilityRules.minAge}
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Maximum Age:
                </span>{" "}
                {policyData.eligibilityRules.maxAge}
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Health Check:
                </span>{" "}
                {policyData.eligibilityRules.healthCheck}
              </div>
            </div>
          </div>

          {/* Coverage Details Card */}
          <div className="bg-white shadow-xl rounded-2xl p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-indigo-500 mr-2">&#128220;</span> Coverage
              Details
            </h2>
            <ul className="flex flex-col gap-1.5 text-gray-600 list-none p-0">
              {policyDetails?.coverageDetails?.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center pl-0 rounded-lg"
                >
                  <div>
                    <span className="font-semibold text-gray-700">
                      {item.coverageType}
                    </span>
                    <p className="text-xs text-gray-500 mb-2">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">
                    {item.coverageLimit.amount.toLocaleString()}{" "}
                    {item.coverageLimit.currency}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Audience, Regions, and Claim Types Card */}
          <div className="bg-white shadow-xl rounded-2xl p-4 md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-indigo-500 mr-2">&#127760;</span> Audience &
              Regions
            </h2>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex-1 min-w-[200px]">
                <span className="font-semibold text-gray-700 block mb-2">
                  Target Audience:
                </span>
                <div className="flex flex-wrap gap-2">
                  {policyData.targetAudience.map((audience, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <span className="font-semibold text-gray-700 block mb-2">
                  Regions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {policyData.regions.map((region, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <span className="font-semibold text-gray-700 block mb-2">
                  Allowed Claim Types:
                </span>
                <div className="flex flex-wrap gap-2">
                  {policyData.allowedClaimTypes.map((claimType, index) => (
                    <span
                      key={index}
                      className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {claimType.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Translations Card */}
          <div className="bg-white shadow-xl rounded-2xl p-4 md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-indigo-500 mr-2">&#127757;</span> Regional
              Translations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(policyData.translations).map(
                ([locale, translation]) => (
                  <div key={locale} className="bg-gray-50 rounded-lg p-4">
                    <span className="font-semibold text-gray-700 text-sm block mb-1">
                      {locale.toUpperCase()}
                    </span>
                    <p className="font-medium text-gray-800">
                      {translation.displayName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {translation.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
