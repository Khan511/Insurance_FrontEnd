import { z } from "zod";

const personNameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const workContactInfoSchema = z.object({
  workPhone: z.string().optional(),
  workEmail: z.string().email("Invalid work email").optional(),
  officeLocation: z.string().optional(),
});

const emergencyContactSchema = z.object({
  name: z.string().optional(),
  relationship: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid emergency contact email").optional(),
});

// Base schema without password for updates
const baseEmployeeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: personNameSchema,
  dateOfBirth: z.string().optional(),
  terminationDate: z.string().optional().nullable(),
  department: z.string().min(1, "Department is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  salary: z.union([
    z.number().positive("Salary must be positive"),
    z
      .string()
      .transform((val) => parseFloat(val))
      .refine(
        (val) => !isNaN(val) && val > 0,
        "Salary must be a positive number"
      ),
  ]),

  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]),
  roleType: z.enum(["AGENT", "CLAIM_MANAGER", "ADMIN"]),
  workContactInfo: workContactInfoSchema.optional(),
  emergencyContact: emergencyContactSchema.optional(),
});

// Create schema with required password
export const employeeCreateSchema = baseEmployeeSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Update schema without password (we'll handle password separately)
// export const employeeUpdateSchema = baseEmployeeSchema;
export const employeeUpdateSchema = baseEmployeeSchema.extend({
  password: z.string().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeCreateSchema>;
export type EmployeeUpdateData = z.infer<typeof employeeUpdateSchema>;
