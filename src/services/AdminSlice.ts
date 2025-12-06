import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { InsuracePolicy } from "./ServiceTypes";
import type { ClaimApiResponse } from "@/pages/claim/Types";

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
  status?: "ACTIVE" | "INACTIVE";
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

    updateClaim: builder.mutation({
      query: ({ updates }) => ({
        url: `/admin/update-claim`,
        method: "PUT",
        body: updates,
      }),
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
        url: `/admin/customers/${updateData.customerId}`,
        method: "PUT",
        body: updateData,
      }),
      // invalidatesTags: (result, error, { customerId }) => [
      //   { type: "Customer", id: customerId },
      // ],
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
} = AdminSlice;
