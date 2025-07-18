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
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CalendarIcon, User } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Link, useNavigate } from "react-router";
import { useCreateUserMutation } from "@/services/UserApiSlice";
import { PopoverTrigger } from "@radix-ui/react-popover";

import { format } from "date-fns";
import { Popover, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";

export default function UserCreatingForme() {
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();

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
    const result = await createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      dateOfBirth: data.dateOfBirth,
    });

    console.log("CreateUser Result", result);
    navigate("/login");
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
        <div className="text-center mb-5">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="h-8 w-8 text-white" />
          </div>
          <p className="text-xl">User Registration</p>
        </div>

        <div className="grid  grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Martin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Andersen" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col my-4">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl className="bg-white">
                    <Button variant="outline">
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="agreeToTerm"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I agree to the terms and conditions.</FormLabel>
                <FormDescription>
                  By checking this, you confirm compliance with 2025 insurance
                  regulations
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full text-white">
          Create User
        </Button>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" className="px-0 text-blue-600" asChild>
            <Link to="/login">
              <span className="text-blue-500 underline">Sign In</span>
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
