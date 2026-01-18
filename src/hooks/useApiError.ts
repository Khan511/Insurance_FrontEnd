// src/hooks/useApiError.ts
import { handleApiError, isAuthError } from "@/utils/handleApiError";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

interface UseApiErrorOptions {
  error: FetchBaseQueryError | SerializedError | undefined;
  isError: boolean;
  redirectOnAuthError?: boolean;
  onError?: (error: FetchBaseQueryError | SerializedError) => void;
}

export const useApiError = ({
  error,
  isError,
  redirectOnAuthError = true,
  onError,
}: UseApiErrorOptions) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isError && error) {
      // Handle the error
      handleApiError(error);

      // Redirect on auth error if enabled
      if (redirectOnAuthError && isAuthError(error)) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

      // Call custom error handler if provided
      if (onError) {
        onError(error);
      }
    }
  }, [error, isError, redirectOnAuthError, navigate, onError]);
};
