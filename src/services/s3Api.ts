import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = "http://localhost:8080/api/s3";

export const s3Api = createApi({
  reducerPath: "s3Api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  // tagTypes: ["Auth"],
  tagTypes: ["user", "roles"],
  endpoints: (builder) => ({
    deleteFile: builder.mutation<void, string>({
      query: (fileUrl) => ({
        url: `/delete-object?imageUrl=${encodeURIComponent(fileUrl)}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const { useDeleteFileMutation } = s3Api;
