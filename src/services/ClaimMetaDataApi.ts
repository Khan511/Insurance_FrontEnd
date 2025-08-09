import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:8080/api/claim";

export const claimMetadataApi = createApi({
  reducerPath: "claimMetadataApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    getClaimTypes: builder.query<{ type: string; description: string }[], void>(
      {
        query: () => "/claim-document-types",
      }
    ),

    getRequiredDocuments: builder.query<string[], string>({
      query: (claimType) => `/required-documents?claimType=${claimType}`,
    }),

    getIncidentTypes: builder.query<string[], string>({
      query: (claimType) => `/incident-types?claimType=${claimType}`,
    }),
  }),
});

export const {
  useGetClaimTypesQuery,
  useGetRequiredDocumentsQuery,
  useGetIncidentTypesQuery,
} = claimMetadataApi;
