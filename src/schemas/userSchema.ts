import { z } from "zod";

export const userFormSchema = z.object({
  firstName: z.string().min(2, "Minmum 2 characters required"),
  lastName: z.string().min(2, "Minmum 2 characters required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Minimum 4 characters required"),
  // phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  // address: z.string().min(5, "Minimum 5 characters required"),
  // insuranceType: z.enum(["health", "auto", "life", "property"], {
  //   required_error: "Please select an insurance type",
  // }),
  agreeToTerm: z.boolean().refine((val) => val, "You must agree to terms"),
  dateOfBirth: z.date({
    required_error: "Date of bith is required",
    invalid_type_error: "Invalid date format",
  }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
