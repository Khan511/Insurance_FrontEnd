import { z } from "zod";

// Base schema with common fields
const baseSchema = z.object({
  paymentFrequency: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL"], {
    required_error: "Payment frequency is required",
  }),
});

// Auto insurance specific schema
const autoSchema = baseSchema.extend({
  vehicleValue: z
    .number({
      required_error: "Vehicle value is required",
      invalid_type_error: "Vehicle value must be a number",
    })
    .min(1, "Vehicle value must be greater than 0"),
  drivingExperience: z
    .number({
      required_error: "Driving experience is required",
      invalid_type_error: "Driving experience must be a number",
    })
    .min(0, "Driving experience cannot be negative")
    .max(80, "Driving experience seems unrealistic"),
});

// Life insurance specific schema
const lifeSchema = baseSchema.extend({
  healthCondition: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR"], {
    required_error: "Health condition is required",
  }),
});

// Property insurance specific schema
const propertySchema = baseSchema.extend({
  propertyValue: z
    .number({
      required_error: "Property value is required",
      invalid_type_error: "Property value must be a number",
    })
    .min(1, "Property value must be greater than 0"),
  propertyLocation: z.enum(["LOW_RISK", "MEDIUM_RISK", "HIGH_RISK"], {
    required_error: "Property location is required",
  }),
});

// Union type for all insurance types
export const insuranceFormSchema = z.discriminatedUnion("insuranceType", [
  z.object({
    insuranceType: z.literal("AUTO"),
    ...autoSchema.shape,
  }),
  z.object({
    insuranceType: z.literal("LIFE"),
    ...lifeSchema.shape,
  }),
  z.object({
    insuranceType: z.literal("PROPERTY"),
    ...propertySchema.shape,
  }),
]);

// Type inference
export type InsuranceFormData = z.infer<typeof insuranceFormSchema>;

// Alternative: Dynamic schema based on insurance type
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
