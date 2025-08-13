import type { ClaimFormData } from "@/pages/claim/Types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:8080/api/claim-metadata";

export const claimMetadataApi = createApi({
  reducerPath: "claimMetadataApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    getClaimTypes: builder.query<{ type: string; description: string }[], void>(
      {
        query: () => "/claim-types",
      }
    ),

    getRequiredDocuments: builder.query<
      { name: string; displayName: string }[],
      string
    >({
      query: (claimType) => `/required-documents?claimType=${claimType}`,
    }),

    getIncidentTypes: builder.query<string[], string>({
      query: (claimType) => `/incident-types?claimType=${claimType}`,
    }),

    submitClaim: builder.mutation<{ claimId: string }, ClaimFormData>({
      query: (claimData) => ({
        url: "/submit-claim",
        method: "POST",
        body: claimData,
      }),
    }),
  }),
});

export const {
  useGetClaimTypesQuery,
  useGetRequiredDocumentsQuery,
  useGetIncidentTypesQuery,
  useSubmitClaimMutation,
} = claimMetadataApi;
