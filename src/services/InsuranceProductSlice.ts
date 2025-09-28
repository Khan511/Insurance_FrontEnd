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
  // | "HEALTH"
  | "LIFE"
  | "PROPERTY";
// | "TRAVEL"
// | "LIABILITY"
// | "PET";
// New types for premium calculation
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
  // state: string;
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

export const InsuranceProductSlice = createApi({
  reducerPath: "InsuraceProductApi",
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
    getAllProducts: builder.query<InsuraceProduct[], void>({
      query: () => ({
        url: "/product/all-products",
        method: "GET",
      }),
    }),

    getProductDetails: builder.query<InsuraceProduct, number>({
      query: (policyId) => ({
        url: `/product/product-details/${policyId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductDetailsQuery,
  // useBuyPolicyMutation,
} = InsuranceProductSlice;
