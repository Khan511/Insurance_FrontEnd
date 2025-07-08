import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Lock, Mail } from "lucide-react";
import { Separator } from "../ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/services/UserApiSlice";

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

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    // console.log("Login form data:", data);
    try {
      // Send login request
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      console.log("Result from loing:", result);

      navigate("/");
    } catch (error) {
      console.log("Loing error: ", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-5">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome Back
        </h2>
        <p className="text-muted-foreground mt-2">
          Securely access your insurance account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 mr-2" />
                  <FormLabel>Email Address</FormLabel>
                </div>
                <FormControl>
                  <Input
                    placeholder="your.email@example.com"
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 mr-2" />
                  <FormLabel>Password</FormLabel>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Remember me</FormLabel>
                </FormItem>
              )}
            />
            <Button
              variant="link"
              className="text-blue-600 dark:text-blue-400 px-0"
              asChild
            >
              <Link to="/forgot-password">Forgot password?</Link>
            </Button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-6 text-base text-white mb-3"
            disabled={isLoading}
          >
            Sign In to Your Account
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Options */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="py-5">
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="py-5">
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="microsoft"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6v214.6H0V265.4zm233.4 0H448v214.6H233.4V265.4z"
                ></path>
              </svg>
              Microsoft
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Button variant="link" className="px-0 text-blue-600" asChild>
          <Link to="/create-user">
            <span className="text-blue-500 underline">Sign up now</span>
          </Link>
        </Button>
      </div>

      <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-900">
        <h3 className="font-medium flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          2025 Security Compliance
        </h3>
        <p className="text-sm mt-2">
          Our login system adheres to the latest 2025 insurance security
          regulations to protect your sensitive information.
        </p>
      </div>
    </div>
  );
}
