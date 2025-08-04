import { z } from "zod";
import {
  CLAIM_DOCUMENT_TYPES,
  INCIDENT_TYPES,
  type ClaimFormData,
} from "./Types";

const addressSchema = z.object({
  street: z.string().min(2, "Street is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
});

const thirdPartyDetailsSchema = z.object({
  name: z.string().min(2, "Name is required"),
  contactInfo: z.string().min(5, "Contact info is required"),
  insuranceInfo: z.string().min(5, "Insurance info is required"),
});

export const claimFormSchema = z.object({
  policyNumber: z.string().min(5, "Policy number is required"),
  claimType: z.nativeEnum(CLAIM_DOCUMENT_TYPES),

  incidentDetails: z
    .object({
      incidentDateTime: z.string().datetime({ message: "Valid date required" }),
      type: z.nativeEnum(INCIDENT_TYPES),
      location: addressSchema,
      description: z
        .string()
        .min(20, "Description must be at least 20 characters"),
      policeReportNumber: z.string().optional(),
      thirdPartyInvolved: z.boolean(),
      thirdPartyDetails: z.optional(thirdPartyDetailsSchema),
    })
    .refine(
      (data) => {
        if (data.thirdPartyInvolved) {
          return !!data.thirdPartyDetails;
        }
        return true;
      },
      {
        message: "Third party details are required",
        path: ["incidentDetails.thirdPartyDetails"],
      }
    ),
}) satisfies z.ZodType<ClaimFormData>;
