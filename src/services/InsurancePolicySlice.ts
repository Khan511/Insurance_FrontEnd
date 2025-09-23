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
export type InsuracePolicy = {
  id: number;
  productCode: string;
  policyNumber: string;
  displayName: string;
  description: string;
  status: string;
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
  productId?: string;
  status: string;
  customer: Customer;
  // product: string;
  coveragePeriod: CoveragePeriod;
  beneficiaries?: Beneficiaries[];
};

// Policy Payments
interface Payment {
  id: number;
  dueAmount: {
    amount: number;
    currency: string;
  };
  dueDate: string;
  paidDate: string | null;
  status: "pending" | "paid" | "overdue";
}

interface PolicyWithPayments {
  id: number;
  policyNumber: string;
  productType: string;
  premium: {
    amount: number;
    currency: string;
  };
  paymentSchedule: Payment[];
}

export const InsurancePolicySlice = createApi({
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
    getAllPoliciesOfUser: builder.query<InsuracePolicy[], string>({
      query: (userId) => ({
        url: `/policy/user-all-policies/${userId}`,
        method: "GET",
      }),
    }),

    buyPolicy: builder.mutation<string, BuyPolicyFormValues>({
      query: (data) => ({
        url: "/policy/buy-policy",
        method: "POST",
        body: data,
      }),
    }),

    getPolicyDetails: builder.query<InsuracePolicy, string>({
      query: (policyId) => ({
        url: `/policy/policies/${policyId}`,
        method: "GET",
      }),
    }),
    // getPolicyPayments: builder.query<PolicyWithPayments, void>({
    //   query: () => ({
    //     url: `/my-policies/payments`,
    //     method: "GET",
    //   }),
    // }),
  }),
});

export const {
  useBuyPolicyMutation,
  useGetAllPoliciesOfUserQuery,
  useGetPolicyDetailsQuery,
  // useGetPolicyPaymentsQuery,
} = InsurancePolicySlice;
