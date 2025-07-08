import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:8080/api";

type InsuracePolicy = {
  id: number;
  title: string;
  description: string;
  targetAudience: string[];
  region: string[];
  category: {
    id: number;
    name: string;
  };
};

type BuyInsurance = {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: undefined;
    governmentId: {
      idType: undefined;
      idNumber: number;
      issuingCountry: string;
      expirationDate: undefined;
    };
    contactInfo: {
      phone: number;
      alternatePhone: number;
      primaryAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: number;
        country: string;
      };
      billingAddress: {
        street: number;
        city: string;
        state: string;
        postalCode: number;
        country: string;
      };
    };
  };
  product: string;
  coveragePeriod: {
    effectiveDate: undefined;
    expirationDate: undefined;
  };
  premium: {
    amount: string;
    currency: string;
  };
  status: string;
  beneficiaries: [
    {
      name: string;
      relationship: string;
      dateOfBirth: undefined;
      taxCountry: string;
      taxIdentifier: string;
    }
  ];
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
    getAllPolicies: builder.query<InsuracePolicy[], void>({
      query: () => ({
        url: "/policy/all-policies",
        method: "GET",
      }),
    }),

    getPolicyDetails: builder.query<InsuracePolicy, number>({
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
