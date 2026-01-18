import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CreateUserRequest,
  CreateUserResponse,
  EmailVerificationResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UserResponse,
  ValidateResetTokenRequest,
  ValidateResetTokenResponse,
} from "./ServiceTypes";

const baseUrl = "http://localhost:8080/api";

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

    resendVerification: builder.mutation<
      EmailVerificationResponse,
      ResendVerificationRequest
    >({
      query: (email) => ({
        url: "/v1/auth/resend-verification",
        method: "POST",
        body: email,
      }),
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

    // Reset password
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (credentials) => ({
        url: "/user/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),

    validateResetToken: builder.mutation<
      ValidateResetTokenResponse,
      ValidateResetTokenRequest
    >({
      query: (credentials) => ({
        url: "/user/validate-reset-token",
        method: "POST",
        body: credentials,
      }),
    }),

    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (credentials) => ({
        url: "/user/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useCreateUserMutation,
  useGetCurrenttUserQuery,
  useLogoutMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useValidateResetTokenMutation,
  useResetPasswordMutation,
} = userApi;
