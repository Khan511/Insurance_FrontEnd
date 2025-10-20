import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { InsuracePolicy } from "./ServiceTypes";
import type { ClaimApiResponse } from "@/pages/claim/Types";

type GetClaimsResponse = { claim: ClaimApiResponse[] };

const baseUrl = "http://localhost:8080/api";
export const AdminSlice = createApi({
  reducerPath: "AdminSlice",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),

  tagTypes: ["Policy"],
  endpoints: (builder) => ({
    getAllPolicies: builder.query<InsuracePolicy[], void>({
      query: () => ({
        url: "/admin/get-all-policies",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              // Provide tags for each policy in the list
              ...result.map(({ id }) => ({ type: "Policy" as const, id })),
              // And also provide a general tag for the entire list
              "Policy",
            ]
          : ["Policy"],
    }),

    getAllClaims: builder.query<GetClaimsResponse[], void>({
      query: () => ({
        url: "/admin/get-all-claims",
        method: "GET",
      }),
    }),

    updatePolicy: builder.mutation({
      query: (policyData) => ({
        url: `/admin/update-policy`,
        method: "PUT",
        body: policyData,
      }),
      // Invalidate both the specific policy and the list
      invalidatesTags: (result, error, { id }) => [
        { type: "Policy", id },
        "Policy",
      ],
    }),
  }),
});

export const {
  useGetAllPoliciesQuery,
  useGetAllClaimsQuery,
  useUpdatePolicyMutation,
} = AdminSlice;
