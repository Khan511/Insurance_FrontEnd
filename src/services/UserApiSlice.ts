import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:8080/api";
type LoginRequest = {
  email: string;
  password: string;
};

type UserResponse = {
  timeStamp: string;
  status: number;
  path: string;
  message: string;
  data: {
    user: {
      userId: string;
      email: string;
      roles: string[];
      permissions: string[];
    };
  };
};

type CreateUserRequest = {
  firstName: string;
  lastName: string;
} & LoginRequest;

type CreateUserResponse = {
  timeStamp: string;
  status: number;
  path: string;
  message: string;
};

export const userApi = createApi({
  reducerPath: "userApi",
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
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (Credentials) => ({
        url: "/user/login",
        method: "POST",
        body: Credentials,
      }),
      invalidatesTags: [{ type: "user", id: "CURRENT" }],
    }),

    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (data) => ({
        url: "/user/create-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "user", id: "CURRENT" }],
    }),
    getCurrenttUser: builder.query<UserResponse, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: [{ type: "user", id: "CURRENT" }],
    }),

    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      invalidatesTags: [{ type: "user", id: "CURRENT" }],
    }),
  }),
});

export const {
  useLoginMutation,
  useCreateUserMutation,
  useGetCurrenttUserQuery,
  useLogoutMutation,
} = userApi;
