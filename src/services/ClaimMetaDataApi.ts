import type { ClaimApiResponse, ClaimFormData } from "@/pages/claim/Types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:8080/api/claim-metadata";

type GetClaimsResponse = { claim: ClaimApiResponse[] };

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

    getAllClaimsOfUser: builder.query<GetClaimsResponse, string>({
      query: (userId) => ({
        url: `/get-all-claims/${userId}`,
        method: "GET",
      }),
    }),

    // // Add this endpoint for getting pre-signed download URLs
    // getDownloadUrl: builder.query<
    //   { downloadUrl: string; expiresAt: number },
    //   string
    // >({
    //   query: (fileKey) => ({
    //     url: `/presigned-download-url?fileKey=${encodeURIComponent(fileKey)}`,
    //     method: "GET",
    //   }),
    // }),

    // // Add this endpoint for direct file download
    // downloadFile: builder.mutation<Blob, { fileKey: string; fileName: string }>(
    //   {
    //     query: ({ fileKey }) => ({
    //       url: `/download-file?fileKey=${encodeURIComponent(fileKey)}`,
    //       method: "GET",
    //       responseHandler: (response) => response.blob(), // Handle response as blob
    //     }),
    //   }
    // ),
  }),
});

export const {
  useGetClaimTypesQuery,
  useGetRequiredDocumentsQuery,
  useGetIncidentTypesQuery,
  useSubmitClaimMutation,
  useGetAllClaimsOfUserQuery,
  // useGetDownloadUrlQuery,
  // useDownloadFileMutation,
} = claimMetadataApi;
