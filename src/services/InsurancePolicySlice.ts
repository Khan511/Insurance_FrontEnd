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

type BuyPolicyFormValues = {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: Date;
    governmentId: {
      idType?: number;
      idNumber: string;
      issuingCountry: string;
      expirationDate?: Date;
    };
    contactInfo: {
      phone: string;
      alternatePhone: string;
      primaryAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
      billingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    };
  };
  product: string;
  coveragePeriod: {
    effectiveDate?: Date;
    expirationDate?: Date;
  };
  premium: {
    amount: string;
    currency: string;
  };
  // status?: "DRAFT" | "ACTIVE" | "EXPIRED"; // optional if needed later
  beneficiaries: {
    name: string;
    relationship: string;
    dateOfBirth?: Date;
    taxCountry: string;
    taxIdentifier: string;
  }[];
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

    // buyInsurance: builder.mutation<string, BuyInsurance>({
    //   query: (data) => ({

    //   })
    // })
  }),
});

export const { useGetAllPoliciesQuery, useGetPolicyDetailsQuery } =
  InsuracePolicyApi;
