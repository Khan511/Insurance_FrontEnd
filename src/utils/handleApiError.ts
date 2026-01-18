// src/utils/errorHandler.ts
import { toast } from "sonner";
// import { ApiError, isApiError, ERROR_MESSAGES } from "@/types/ApiError";
// import { SerializedError } from "@reduxjs/toolkit";
// import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  ERROR_MESSAGES,
  isApiError,
  type ApiError,
} from "@/services/ServiceTypes";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

/**
 * Main error handler for API errors
 */
export const handleApiError = (
  error: FetchBaseQueryError | SerializedError | undefined
): ApiError | null => {
  console.error("API Error:", error);

  // Check if it's an RTK Query error with data
  if (isApiError(error)) {
    const apiError = error.data;

    // Handle validation errors with field-specific messages
    if (apiError.fieldErrors && Object.keys(apiError.fieldErrors).length > 0) {
      handleValidationErrors(apiError.fieldErrors);
      return apiError;
    }

    // Handle sub-errors (alternative validation format)
    if (apiError.subErrors && apiError.subErrors.length > 0) {
      handleSubErrors(apiError.subErrors);
      return apiError;
    }

    // Handle general API errors
    const message = ERROR_MESSAGES[apiError.errorCode] || apiError.message;
    toast.error(apiError.error || "Error", {
      description: message,
      duration: 5000,
    });

    return apiError;
  }

  // Handle network errors
  if (error && "status" in error) {
    if (error.status === "FETCH_ERROR") {
      toast.error("Network Error", {
        description:
          "Unable to connect to the server. Please check your internet connection.",
        duration: 6000,
      });
      return null;
    }

    if (error.status === "PARSING_ERROR") {
      toast.error("Data Error", {
        description: "Failed to process server response",
        duration: 5000,
      });
      return null;
    }

    if (error.status === "TIMEOUT_ERROR") {
      toast.error("Request Timeout", {
        description: "The request took too long. Please try again.",
        duration: 5000,
      });
      return null;
    }
  }

  // Fallback for unknown errors
  toast.error("Unexpected Error", {
    description: "An unexpected error occurred. Please try again.",
    duration: 5000,
  });

  return null;
};

/**
 * Handle validation errors (field-specific)
 */
const handleValidationErrors = (fieldErrors: Record<string, string>): void => {
  const errorCount = Object.keys(fieldErrors).length;

  if (errorCount === 1) {
    // Show single field error
    const [field, message] = Object.entries(fieldErrors)[0];
    toast.error(`Validation Error`, {
      description: `${formatFieldName(field)}: ${message}`,
      duration: 5000,
    });
  } else {
    // Show multiple field errors
    toast.error("Validation Errors", {
      description: `Please check ${errorCount} fields and try again`,
      duration: 5000,
    });

    // Optionally show individual toasts for each error
    Object.entries(fieldErrors).forEach(([field, message], index) => {
      setTimeout(() => {
        toast.error(formatFieldName(field), {
          description: message,
          duration: 4000,
        });
      }, index * 300); // Stagger the toasts
    });
  }
};

/**
 * Handle sub-errors
 */
const handleSubErrors = (
  subErrors: Array<{ field: string; message: string; rejectedValue?: any }>
): void => {
  toast.error("Validation Errors", {
    description: `Please check ${subErrors.length} fields`,
    duration: 5000,
  });

  subErrors.forEach((error, index) => {
    setTimeout(() => {
      toast.error(formatFieldName(error.field), {
        description: error.message,
        duration: 4000,
      });
    }, index * 300);
  });
};

/**
 * Format field name to be more readable
 */
const formatFieldName = (field: string): string => {
  return field
    .split(/(?=[A-Z])|_/) // Split on camelCase or underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined
): string => {
  if (isApiError(error)) {
    return ERROR_MESSAGES[error.data.errorCode] || error.data.message;
  }
  return "An unexpected error occurred";
};

/**
 * Check if error is authentication related
 */
export const isAuthError = (
  error: FetchBaseQueryError | SerializedError | undefined
): boolean => {
  if (isApiError(error)) {
    return error.status === 401 || error.data.errorCode?.startsWith("AUTH");
  }
  return false;
};

/**
 * Check if error is authorization related
 */
export const isAuthorizationError = (
  error: FetchBaseQueryError | SerializedError | undefined
): boolean => {
  if (isApiError(error)) {
    return error.status === 403;
  }
  return false;
};

/**
 * Extract field errors for form display
 */
export const extractFieldErrors = (
  error: FetchBaseQueryError | SerializedError | undefined
): Record<string, string> => {
  if (isApiError(error) && error.data.fieldErrors) {
    return error.data.fieldErrors;
  }
  return {};
};
