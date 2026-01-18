"use client";

import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import {
  useResetPasswordMutation,
  useValidateResetTokenMutation,
} from "@/services/UserApiSlice";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // Use useNavigate instead of useRouter
  const [searchParams] = useSearchParams(); // Destructure the tuple
  const token = searchParams.get("token"); // Now this works correctly

  const [validateToken] = useValidateResetTokenMutation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    const validateTokenFn = async () => {
      if (!token) {
        setError("Invalid reset link. Please request a new password reset.");
        setIsValidating(false);
        return;
      }

      try {
        await validateToken({ token }).unwrap();
        setIsValidToken(true);
      } catch (err: any) {
        setError(
          err?.data?.message || "This reset link is invalid or has expired.",
        );
      } finally {
        setIsValidating(false);
      }
    };

    validateTokenFn();
  }, [token, validateToken]);

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("at least 8 characters");
    if (!/\d/.test(password)) errors.push("at least one number");
    if (!/[a-z]/.test(password)) errors.push("at least one lowercase letter");
    if (!/[A-Z]/.test(password)) errors.push("at least one uppercase letter");
    if (!/[@#$%^&+=]/.test(password))
      errors.push("at least one special character (@#$%^&+=)");
    if (/\s/.test(password)) errors.push("no spaces");

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasswordError(null);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setPasswordError(`Password must contain: ${passwordErrors.join(", ")}`);
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword,
        confirmPassword,
      }).unwrap();
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err?.data?.message || "Failed to reset password. Please try again.",
      );
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8 flex ">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-center text-xl">
                Invalid Reset Link
              </CardTitle>
              <CardDescription className="text-center">
                {error || "This password reset link is invalid or has expired."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => navigate("/forgot-password")} // Use navigate
                className="w-full"
              >
                Request new reset link
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/login")} // Use navigate
                className="w-full"
              >
                Back to login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Password Reset Successful!</CardTitle>
              <CardDescription>
                Your password has been reset successfully. You can now log in
                with your new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/login")}
                className="w-full text-white  "
              >
                Go to login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>

        <Card className="border-gray-200 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Set new password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError(null);
                  }}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError(null);
                  }}
                  required
                  className="h-11"
                />
              </div>

              {passwordError && (
                <Alert variant="destructive" className="text-red-500">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              <div className="rounded-lg bg-blue-50 p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${newPassword.length >= 8 ? "text-green-500" : "text-gray-400"}`}
                    >
                      ✓
                    </span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${/\d/.test(newPassword) ? "text-green-500" : "text-gray-400"}`}
                    >
                      ✓
                    </span>
                    At least one number
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${/[a-z]/.test(newPassword) ? "text-green-500" : "text-gray-400"}`}
                    >
                      ✓
                    </span>
                    At least one lowercase letter
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${/[A-Z]/.test(newPassword) ? "text-green-500" : "text-gray-400"}`}
                    >
                      ✓
                    </span>
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${/[@#$%^&+=]/.test(newPassword) ? "text-green-500" : "text-gray-400"}`}
                    >
                      ✓
                    </span>
                    At least one special character (@#$%^&+=)
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${!/\s/.test(newPassword) ? "text-green-500" : "text-gray-400"}`}
                    >
                      ✓
                    </span>
                    No spaces
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  <span className="text-white">Reset password</span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
