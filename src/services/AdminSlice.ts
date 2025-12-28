import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { InsuracePolicy } from "./ServiceTypes";
import type {
  ApproveClaimRequest,
  ClaimApiResponse,
  RejectClaimRequest,
  UpdateClaimStatusRequest,
} from "@/pages/claim/Types";

type GetClaimsResponse = { claim: ClaimApiResponse[] };

const baseUrl = "http://localhost:8080/api";

export type Payment = {
  id: number;
  policyNumber: string;
  customerName: string;
  amount: number;
  status: "PAID" | "PENDING" | "OVERDUE" | "FAILED";
  dueDate: string;
  paidDate?: string;
};

export type AdminCustomers = {
  customerId: string;
  email: string;
  joinDate: string;
  numberOfPolicies: number;
  premium: string;
  currency: string;
  status: string;

  customerDateOfBirth: string;
  customerFirstname: string;
  customerLastname: string;
  customerActivePolicies: number;
  customerPhone: string;
  customerAlternativePhone: string;

  customerIdType: string;
  customerIdMaskedNumber: string;
  idIssuingCountry: string;
  idExpirationDate: string;
  idVerificationStatus: string;

  customerPrimaryAddressStreet: string;
  customerPrimaryAddressCity: string;
  customerPrimaryAddressPostalCode: string;
  customerPrimaryAddressCountry: string;

  customerBillingAddressStreet: string;
  customerBillingAddressCity: string;
  customerBillingAddressPostalCode: string;
  customerBillingAddressCountry: string;
};

// Update request type (only editable fields)
export interface UpdateCustomerRequest {
  customerId: string;
  customerFirstname?: string;
  customerLastname?: string;
  email?: string;
  customerDateOfBirth?: string;
  customerPhone?: string;
  customerAlternativePhone?: string;

  customerPrimaryAddressStreet?: string;
  customerPrimaryAddressCity?: string;
  customerPrimaryAddressPostalCode?: string;
  customerPrimaryAddressCountry?: string;

  customerBillingAddressStreet?: string;
  customerBillingAddressCity?: string;
  customerBillingAddressPostalCode?: string;
  customerBillingAddressCountry?: string;
}

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

  // Add "Claims" to tagTypes array
  tagTypes: ["Policy", "Claims"], // <-- ADD "Claims" HERE

  endpoints: (builder) => ({
    getAllPolicies: builder.query<InsuracePolicy[], void>({
      query: () => ({
        url: "/admin/get-all-policies",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Policy" as const, id })),
              "Policy",
            ]
          : ["Policy"],
    }),

    getAllClaims: builder.query<
      ClaimApiResponse[],
      { sortBy?: string; sortDirection?: string }
    >({
      // <-- Changed type to ClaimApiResponse[]
      query: (params = {}) => ({
        url: "/admin/get-all-claims",
        method: "GET",
        params: {
          sortBy: params.sortBy || "submissionDate",
          sortDirection: params.sortDirection || "DESC",
        },
      }),
      // Add providesTags for Claims
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Claims" as const, id })),
              "Claims",
            ]
          : ["Claims"],
    }),

    getClaimDetails: builder.query<ClaimApiResponse, number>({
      query: (claimId) => ({
        url: `/admin/claim-details/${claimId}`,
        method: "GET",
      }),
    }),

    updatePolicy: builder.mutation({
      query: (policyData) => ({
        url: `/admin/update-policy`,
        method: "PUT",
        body: policyData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Policy", id },
        "Policy",
      ],
    }),

    updateClaim: builder.mutation({
      query: ({ updates }) => ({
        url: `/admin/update-claim`,
        method: "PUT",
        body: updates,
      }),
      // Invalidate Claims when updating a claim
      invalidatesTags: ["Claims"],
    }),

    getAllPayments: builder.query<Payment[], void>({
      query: () => ({
        url: "/admin/get-all-payments",
        method: "GET",
      }),
    }),

    getAllCustomers: builder.query<AdminCustomers[], void>({
      query: () => ({
        url: "/admin/get-all-customers",
        method: "GET",
      }),
    }),

    getCustomerByUserIds: builder.query<AdminCustomers, string>({
      query: (customerId) => ({
        url: `/admin/get-customer/${customerId}`,
        method: "GET",
      }),
    }),

    updateCustomer: builder.mutation<AdminCustomers, UpdateCustomerRequest>({
      query: (updateData) => ({
        url: `/admin/update-customers`,
        method: "PATCH",
        body: updateData,
      }),
    }),

    // Claim action endpoints
    approveClaim: builder.mutation<void, ApproveClaimRequest>({
      query: ({ claimId, approvedAmount, notes }) => ({
        url: `/admin/claims/${claimId}/approve`,
        method: "PATCH",
        body: { approvedAmount, notes },
      }),
      invalidatesTags: ["Claims"], // Now this works
    }),

    rejectClaim: builder.mutation<void, RejectClaimRequest>({
      query: ({ claimId, rejectionReason, notes }) => ({
        url: `/admin/claims/${claimId}/reject`,
        method: "PATCH",
        body: { rejectionReason, notes },
      }),
      invalidatesTags: ["Claims"], // Now this works
    }),

    markClaimAsPaid: builder.mutation<
      void,
      { claimId: number; notes?: string }
    >({
      query: ({ claimId, notes }) => ({
        url: `/admin/claims/${claimId}/mark-paid`, // Fixed URL to match controller
        method: "PATCH", // Changed from POST to PATCH
        body: { notes },
      }),
      invalidatesTags: ["Claims"], // Now this works
    }),

    updateClaimStatus: builder.mutation<void, UpdateClaimStatusRequest>({
      query: ({ claimId, status, claimAmount, reason }) => ({
        url: `/api/admin/claims/${claimId}/status`,
        method: "PUT",
        body: { status, claimAmount, reason },
      }),
      invalidatesTags: ["Claims"], // Now this works
    }),
  }),
});

export const {
  useGetAllPoliciesQuery,
  useGetAllClaimsQuery,
  useUpdatePolicyMutation,
  useUpdateClaimMutation,
  useGetAllPaymentsQuery,
  useGetAllCustomersQuery,
  useGetCustomerByUserIdsQuery,
  useUpdateCustomerMutation,
  useApproveClaimMutation,
  useRejectClaimMutation,
  useMarkClaimAsPaidMutation,
  useUpdateClaimStatusMutation,
  useGetClaimDetailsQuery,
} = AdminSlice;
