// import { z } from "zod";

// // Base schema with common fields
// const baseSchema = z.object({
//   paymentFrequency: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL"], {
//     required_error: "Payment frequency is required",
//   }),
// });

// // Auto insurance specific schema
// const autoSchema = baseSchema.extend({
//   vehicleValue: z
//     .number({
//       required_error: "Vehicle value is required",
//       invalid_type_error: "Vehicle value must be a number",
//     })
//     .min(1, "Vehicle value must be greater than 0"),
//   drivingExperience: z
//     .number({
//       required_error: "Driving experience is required",
//       invalid_type_error: "Driving experience must be a number",
//     })
//     .min(0, "Driving experience cannot be negative")
//     .max(80, "Driving experience seems unrealistic"),
// });

// // Life insurance specific schema
// const lifeSchema = baseSchema.extend({
//   healthCondition: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR"], {
//     required_error: "Health condition is required",
//   }),
// });

// // Property insurance specific schema
// const propertySchema = baseSchema.extend({
//   propertyValue: z
//     .number({
//       required_error: "Property value is required",
//       invalid_type_error: "Property value must be a number",
//     })
//     .min(1, "Property value must be greater than 0"),
//   propertyLocation: z.enum(["LOW_RISK", "MEDIUM_RISK", "HIGH_RISK"], {
//     required_error: "Property location is required",
//   }),
// });

// // Union type for all insurance types
// export const insuranceFormSchema = z.discriminatedUnion("insuranceType", [
//   z.object({
//     insuranceType: z.literal("AUTO"),
//     ...autoSchema.shape,
//   }),
//   z.object({
//     insuranceType: z.literal("LIFE"),
//     ...lifeSchema.shape,
//   }),
//   z.object({
//     insuranceType: z.literal("PROPERTY"),
//     ...propertySchema.shape,
//   }),
// ]);

// // Type inference
// export type InsuranceFormData = z.infer<typeof insuranceFormSchema>;

// // Alternative: Dynamic schema based on insurance type
// export const createInsuranceSchema = (insuranceType: string) => {
//   switch (insuranceType) {
//     case "AUTO":
//       return autoSchema;
//     case "LIFE":
//       return lifeSchema;
//     case "PROPERTY":
//       return propertySchema;
//     default:
//       return baseSchema;
//   }
// };

import { z } from "zod";

// Helper function to calculate age from date string
const calculateAge = (dateString: string): number => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// Helper function to validate date of birth
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Base schema with common fields including dateOfBirth
const baseSchema = z.object({
  insuranceType: z.enum(["AUTO", "LIFE", "PROPERTY"]),
  paymentFrequency: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL"], {
    required_error: "Payment frequency is required",
  }),
  dateOfBirth: z
    .string()
    .optional()
    .refine(
      (val) => {
        // If dateOfBirth is provided, validate it
        if (val) {
          if (!isValidDate(val)) return false;
          const age = calculateAge(val);
          return age >= 18 && age <= 100;
        }
        return true;
      },
      {
        message: "Date must be valid and age must be between 18-100 years",
      },
    )
    .transform((val) => val || undefined),
});

// Auto insurance specific schema
const autoSchema = baseSchema.extend({
  insuranceType: z.literal("AUTO"),
  vehicleValue: z
    .number({
      required_error: "Vehicle value is required",
      invalid_type_error: "Vehicle value must be a number",
    })
    .min(1000, "Vehicle value must be at least $1,000")
    .max(1000000, "Vehicle value cannot exceed $1,000,000"),
  drivingExperience: z
    .number({
      required_error: "Driving experience is required",
      invalid_type_error: "Driving experience must be a number",
    })
    .min(0, "Driving experience cannot be negative")
    .max(80, "Driving experience seems unrealistic"),
  dateOfBirth: z
    .string({
      required_error: "Date of birth is required for auto insurance",
    })
    .refine(
      (val) => {
        if (!isValidDate(val)) return false;
        const age = calculateAge(val);
        return age >= 18 && age <= 85;
      },
      {
        message: "For auto insurance, age must be between 18-85 years",
      },
    ),
});

// Life insurance specific schema
const lifeSchema = baseSchema.extend({
  insuranceType: z.literal("LIFE"),
  healthCondition: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR"], {
    required_error: "Health condition is required",
  }),
  dateOfBirth: z
    .string({
      required_error: "Date of birth is required for life insurance",
    })
    .refine(
      (val) => {
        if (!isValidDate(val)) return false;
        const age = calculateAge(val);
        return age >= 18 && age <= 70;
      },
      {
        message: "For life insurance, age must be between 18-70 years",
      },
    ),
});

// Property insurance specific schema - dateOfBirth is optional
const propertySchema = baseSchema.extend({
  insuranceType: z.literal("PROPERTY"),
  propertyValue: z
    .number({
      required_error: "Property value is required",
      invalid_type_error: "Property value must be a number",
    })
    .min(10000, "Property value must be at least $10,000")
    .max(10000000, "Property value cannot exceed $10,000,000"),
  propertyLocation: z.enum(["LOW_RISK", "MEDIUM_RISK", "HIGH_RISK"], {
    required_error: "Property location is required",
  }),
  // dateOfBirth remains optional from base schema
});

// Union type for all insurance types
export const insuranceFormSchema = z.discriminatedUnion("insuranceType", [
  autoSchema,
  lifeSchema,
  propertySchema,
]);

// Type inference
export type InsuranceFormData = z.infer<typeof insuranceFormSchema>;

// Alternative: Dynamic schema based on insurance type (for backward compatibility)
export const createInsuranceSchema = (insuranceType: string) => {
  switch (insuranceType) {
    case "AUTO":
      return autoSchema;
    case "LIFE":
      return lifeSchema;
    case "PROPERTY":
      return propertySchema;
    default:
      return baseSchema;
  }
};

// Helper functions for form validation
export const validateDateOfBirth = (
  dateOfBirth: string | undefined,
  insuranceType?: string,
): { isValid: boolean; age?: number; error?: string } => {
  if (!dateOfBirth) {
    return {
      isValid: insuranceType === "PROPERTY",
      error:
        insuranceType === "PROPERTY" ? undefined : "Date of birth is required",
    };
  }

  if (!isValidDate(dateOfBirth)) {
    return { isValid: false, error: "Invalid date format" };
  }

  const age = calculateAge(dateOfBirth);

  switch (insuranceType) {
    case "AUTO":
      if (age < 18 || age > 85) {
        return {
          isValid: false,
          age,
          error: "For auto insurance, age must be between 18-85 years",
        };
      }
      break;
    case "LIFE":
      if (age < 18 || age > 70) {
        return {
          isValid: false,
          age,
          error: "For life insurance, age must be between 18-70 years",
        };
      }
      break;
    default:
      if (age < 18 || age > 100) {
        return {
          isValid: false,
          age,
          error: "Age must be between 18-100 years",
        };
      }
  }

  return { isValid: true, age };
};

// Function to get default values for form
export const getDefaultValues = (
  insuranceType: "AUTO" | "LIFE" | "PROPERTY",
) => {
  const defaults = {
    insuranceType,
    paymentFrequency: "MONTHLY" as const,
    dateOfBirth: undefined as string | undefined,
  };

  switch (insuranceType) {
    case "AUTO":
      return {
        ...defaults,
        vehicleValue: 0,
        drivingExperience: 0,
      };
    case "LIFE":
      return {
        ...defaults,
        healthCondition: "GOOD" as const,
      };
    case "PROPERTY":
      return {
        ...defaults,
        propertyValue: 0,
        propertyLocation: "MEDIUM_RISK" as const,
      };
    default:
      return defaults;
  }
};
