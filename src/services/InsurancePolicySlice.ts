import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:8080/api";

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

export type ProductType =
  | "AUTO"
  | "HEALTH"
  | "LIFE"
  | "PROPERTY"
  | "TRAVEL"
  | "LIABILITY"
  | "PET";

export type InsuraceProduct = {
  id: number;
  productCode: string;
  displayName: string;
  description: string;
  productType: ProductType;
  basePremium: MonetaryAmount;
  coverageDetails: CoverageDetails[];
  eligibilityRules: { [key: string]: string };
  targetAudience: string[];
  regions: string[];
  category: Category;
  validityPeriod: PolicyPeriod;
  allowedClaimTypes: string[];
  translation: { [locale: string]: ProductTranslation };
};

export type GovernmentId = {
  // idType?: number;
  idType?: string;
  idNumber: string;
  issuingCountry: string;
  // expirationDate?: string;
  expirationDate?: Date;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type ContactInfo = {
  phone: string;
  alternatePhone?: string | undefined;
  primaryAddress: Address;
  billingAddress: Address;
};

export type Beneficiaries = {
  name: string;
  relationship: string;
  dateOfBirth?: Date;
  taxCountry: string;
  taxIdentifier: string;
};

export type CoveragePeriod = {
  effectiveDate: Date | null | undefined;
};
export type Customer = {
  userId?: string;
  governmentId: GovernmentId;
  contactInfo: ContactInfo;
};
type BuyPolicyFormValues = {
  policyId?: string;
  status: string;
  customer: Customer;
  product: string;
  coveragePeriod: CoveragePeriod;
  beneficiaries: Beneficiaries[];
};

export const InsuracePolicyApi = createApi({
  reducerPath: "InsuracePolicyApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),

  tagTypes: ["policy"],
  endpoints: (builder) => ({
    getAllPolicies: builder.query<InsuraceProduct[], void>({
      query: () => ({
        url: "/policy/all-policies",
        method: "GET",
      }),
    }),

    getPolicyDetails: builder.query<InsuraceProduct, number>({
      query: (policyId) => ({
        url: `/policy/policy-details/${policyId}`,
        method: "GET",
      }),
    }),

    buyInsurance: builder.mutation<string, BuyPolicyFormValues>({
      query: (data) => ({
        url: "/policy/buy-policy",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllPoliciesQuery,
  useGetPolicyDetailsQuery,
  useBuyInsuranceMutation,
} = InsuracePolicyApi;
