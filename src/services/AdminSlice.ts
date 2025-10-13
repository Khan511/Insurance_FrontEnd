import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { InsuracePolicy } from "./ServiceTypes";

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

  tagTypes: ["policy"],
  endpoints: (builder) => ({
    getAllPolicies: builder.query<InsuracePolicy[], void>({
      query: () => ({
        url: "/admin/get-all-policies",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllPoliciesQuery } = AdminSlice;
