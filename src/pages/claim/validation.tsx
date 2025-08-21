import { z } from "zod";
import { type ClaimFormData } from "./Types";

const documentAttachmentSchema = z.object({
  storageId: z.string(),
  downloadUrl: z.string().url(),
  storagePath: z.string(),
  originalFileName: z.string(),
  contentType: z.string(),
  // sha256Checksum: z.string(),
  documentType: z.string(),
});

const addressSchema = z.object({
  street: z.string().min(2, "Street is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
});

const thirdPartyDetailsSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    contactInfo: z.string().min(5, "Contact info is required"),
    insuranceInfo: z.string().min(5, "Insurance info is required"),
  })
  .optional();

export const claimFormSchema = z.object({
  policyNumber: z.string().min(5, "Policy number is required"),
  claimType: z.string().min(1, "Claim type is required"),

  incidentDetails: z
    .object({
      incidentDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Valid date and time required",
      }),
      type: z.string().min(1, "Incident type is required"),
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
  documents: z.array(documentAttachmentSchema),
  // .refine((docs) => docs.length > 0, "At least one document is required"),
}) satisfies z.ZodType<ClaimFormData>;
