import { userFormSchema, type UserFormValues } from "@/schemas/userSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { CalendarIcon, User, Check, Sparkles, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Popover, PopoverContent } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateUserMutation } from "@/services/UserApiSlice";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function UserCreatingForme() {
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: undefined,
      agreeToTerm: false,
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    console.log("Form Data: ", data);

    try {
      const result = await createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        dateOfBirth: data.dateOfBirth,
      }).unwrap();

      console.log("CreateUser Result", result);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="relative">
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-50 rounded-2xl">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Account Created!
            </h3>
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-30"></div>
              <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <User className="h-10 w-10 text-white" />
                <Sparkles
                  className="absolute -top-1 -right-1 h-6 w-6 text-yellow-300"
                  fill="currentColor"
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-gray-600 mt-2">
                Join our platform in less than 2 minutes
              </p>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="group">
                  <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">👤</span>
                      </div>
                      <Input
                        placeholder="Enter your first name"
                        {...field}
                        className="px-5 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="group">
                  <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter your last name"
                        {...field}
                        className="h-12 px-5 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            {/* Email */}
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
                        <span className="text-gray-400 text-sm">✉️</span>
                      </div>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                        className="px-5 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="group">
                  <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">🔒</span>
                      </div>
                      <Input
                        type="password"
                        placeholder="Create a strong password"
                        {...field}
                        className="px-5 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500 mt-2">
                    Must be at least 8 characters with letters and numbers
                  </FormDescription>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Date of Birth
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-12 pl-4 rounded-xl text-left font-normal justify-start border-gray-300 hover:bg-gray-50 transition-all duration-200",
                          !field.value && "text-gray-500"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">📅</span>
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select your date of birth</span>
                          )}
                        </div>
                        <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 rounded-xl border-gray-200 shadow-xl bg-white"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      className="rounded-xl p-3"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Terms and Conditions */}
          <FormField
            control={form.control}
            name="agreeToTerm"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <FormControl>
                  <div className="relative">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-5 w-5 rounded-lg border-2"
                    />
                    {field.value && (
                      <Check className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-white pointer-events-none" />
                    )}
                  </div>
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-medium text-gray-900 cursor-pointer">
                    I agree to the terms and conditions
                  </FormLabel>
                  <FormDescription className="text-xs text-gray-600">
                    By creating an account, you agree to our Terms of Service
                    and Privacy Policy, and confirm compliance with 2025
                    insurance regulations.
                  </FormDescription>
                </div>
                <FormMessage className="text-red-500 text-sm absolute -bottom-5 left-14" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h5 w5 animate-spin" />
                {/* <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> */}
                Creating Account...
              </div>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Create Account
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              asChild
            >
              <Link to="/login">
                <span className="text-blue-600 font-medium">
                  Sign In to Your Account
                </span>
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
