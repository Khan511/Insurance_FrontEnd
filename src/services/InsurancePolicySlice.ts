import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BuyPolicyFormValues,
  InsuracePolicy,
  PremiumCalculationRequest,
  PremiumCalculationResponse,
} from "./ServiceTypes";

const baseUrl = "http://localhost:8080/api";

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
    processPayment: builder.mutation<{ message: string }, number>({
      query: (scheduleId) => ({
        url: `/my-policies/process-payment/${scheduleId}`,
        method: "POST",
        // body: scheduleId,
      }),
      invalidatesTags: ["policy"],
    }),
    // getPolicyPayments: builder.query<PolicyWithPayments, void>({
    //   query: () => ({
    //     url: `/my-policies/payments`,
    //     method: "GET",
    //   }),
    // }),

    calculatePremium: builder.mutation<
      PremiumCalculationResponse,
      PremiumCalculationRequest
    >({
      query: (data) => ({
        url: "/premium/calculate",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useBuyPolicyMutation,
  useGetAllPoliciesOfUserQuery,
  useGetPolicyDetailsQuery,
  useCalculatePremiumMutation,
  useProcessPaymentMutation,
  // useGetPolicyPaymentsQuery,
} = InsurancePolicySlice;
