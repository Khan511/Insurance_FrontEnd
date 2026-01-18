import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";
import { Lock, Mail, Eye, EyeOff, Shield, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/services/UserApiSlice";
import { useState } from "react";

// Zod schema for login form validation
const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(32, "Password cannot exceed 32 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      console.log("Result from login:", result);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.log("Login error: ", error);
    }
  };

  return (
    <div className="w-full">
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 rounded-3xl flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-linear-to-br from-green-600 to-emerald-700 bg-clip-text text-transparent">
                Access Granted!
              </h3>
              <p className="text-gray-600 mt-2">Welcome back! Redirecting...</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-6">
          <div className="absolute -inset-1 bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-30 animate-pulse"></div>
          <div className="relative bg-linear-to-br from-blue-600 to-indigo-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-10 w-10 text-white" />
            <Sparkles
              className="absolute -top-1 -right-1 h-6 w-6 text-yellow-300"
              fill="currentColor"
            />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-br from-gray-900 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">
            Secure access to your insurance dashboard
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      placeholder="your.email@company.com"
                      className="px-5 h-14 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-base"
                      {...field}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-300">@</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="group">
                <div className="flex items-center justify-between mb-2">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Password
                  </FormLabel>
                  <Button
                    variant="link"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium px-0 h-auto"
                    asChild
                  >
                    <Link to="/forgot-password">Forgot password?</Link>
                  </Button>
                </div>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your secure password"
                      className="px-5 pr-12 h-14 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-base"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />

          {/* Remember Me */}
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <div className="relative">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-5 w-5 rounded-lg border-2"
                    />
                    {field.value && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-medium text-gray-900 cursor-pointer">
                    Keep me signed in
                  </FormLabel>
                  <p className="text-xs text-gray-500">
                    Recommended for personal devices only
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg font-semibold bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Securing Access...
              </div>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                <span className="text-2xl"> Sign In</span>
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Options */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-14 rounded-xl border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all duration-200 group"
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-linear-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium group-hover:text-red-600">
                  Google
                </span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-xl border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 group"
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <svg
                    className="w-4 h-4 fill-current text-[#00A4EF]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 0v11.408h11.408V0zm12.594 0v11.408H24V0zM0 12.594v11.408h11.408V12.594zm12.594 0v11.408H24V12.594z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium group-hover:text-blue-600">
                  Microsoft
                </span>
              </div>
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-10 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              New to our platform?{" "}
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-800 text-base font-semibold p-0 h-auto"
                asChild
              >
                <Link to="/create-user">Create an account</Link>
              </Button>
            </p>
          </div>
        </form>
      </Form>

      {/* Security Info */}
      <div className="mt-8 bg-linear-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-5 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              2025 Security Compliance
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Active
              </span>
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Your session is protected with AES-256 encryption, multi-factor
              authentication, and real-time threat detection as per 2025
              insurance security regulations.
            </p>
          </div>
        </div>
      </div>

      {/* Login Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">4.8M+</div>
          <div className="text-xs text-gray-500">Active Users</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">99.95%</div>
          <div className="text-xs text-gray-500">Uptime</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">256-bit</div>
          <div className="text-xs text-gray-500">Encryption</div>
        </div>
      </div>
    </div>
  );
}
