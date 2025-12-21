export type ClaimDocumentType = string;
export type IncidentType = string;
export type RequiredDocumentType = string;

export type Address = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

export type ThirdPartyDetails = {
  name: string;
  contactInfo: string;
  insuranceInfo: string;
};

// In your Types.ts file
export interface DocumentAttachment {
  storageId: string;
  storageBucket: string;
  originalFileName: string;
  contentType: string;
  sha256Checksum: string;
  documentType: string;
  fileKey: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export type ClaimFormData = {
  policyNumber: string;
  claimNumber: string;
  claimType: ClaimDocumentType;
  status: string;
  incidentDetails: {
    incidentDateTime: string;
    claimAmount: number | null;
    type: IncidentType;
    location: Address;
    description: string;
    policeReportNumber?: string;
    thirdPartyInvolved: boolean;
    thirdPartyDetails?: ThirdPartyDetails;
  };
  documents: DocumentAttachment[];
};

// // In your Types.ts file
// export interface ClaimApiResponse {
//   claimNumber: string;
//   claimType: string;
//   status: string;
//   amount?: string;
//   incidentDetails: {
//     description: string;
//     incidentDateTime: [number, number, number, number?, number?]; // Tuple format
//     location: {
//       street: string;
//       city: string;
//       postalCode: string;
//       country: string;
//     };
//     policeReportNumber: string;
//     thirdPartyDetails: {
//       name: string;
//       contactInfo: string;
//       insuranceInfo: string;
//     };
//     thirdPartyInvolved: boolean;
//     type: string;
//   };
//   policyNumber: string;
//   documents: Array<{
//     contentType: string;
//     documentType: string;
//     downloadUrl: string | null;
//     fileKey: string | null;
//     fileSize: number | null;
//     fileUrl: string | null;
//     originalFileName: string;
//     sha256Checksum: string;
//     storageBucket: string;
//     storageId: string;
//     storagePath: string | null;
//     uploadedAt: string | null;
//   }>;
// }

// request types for claim actions
export interface ApproveClaimRequest {
  claimId: number;
  approvedAmount: number;
  notes?: string;
}
export interface MarkAsPaidRequest {
  claimId: number; // Database ID
  paymentReference?: string;
  notes?: string;
}

export interface RejectClaimRequest {
  claimId: number;
  rejectionReason: string;
  notes?: string;
}

export interface UpdateClaimStatusRequest {
  claimId: number;
  status: string;
  claimAmount?: number;
  reason?: string;
}

// Types.ts (update your existing Claim types)
export interface ClaimApiResponse {
  id: number;
  policyNumber: string;
  claimNumber: string;
  storageBucket: string;
  status: string;

  approvedAmount: number | null;
  claimType: string;

  // New fields
  submissionDate: string | string;
  approvedDate: string | null;
  rejectedDate: string | null;
  paidDate: string | null;
  closedDate: string | null;
  processedBy: string | null;
  rejectionReason: string | null;

  // Calculated fields
  processingDays: number;
  isOpen: boolean;
  isProcessed: boolean;
  canBeApproved: boolean;
  canBeRejected: boolean;

  // Product and user info
  productName: string | null;
  productCode: string | null;
  customerName: string | null;
  customerEmail: string | null;
  // Payment fields
  paymentStatus: string;
  approvalNotes?: string;
  paidBy?: string;
  paymentReference?: string;
  paymentNotes?: string;

  // UI flags
  canBePaid: boolean;
  isFullyPaid: boolean;

  incidentDetails: {
    description: string;
    incidentDateTime: [number, number, number, number?, number?];
    claimAmount: number | null;
    location: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    policeReportNumber: string;
    thirdPartyDetails: {
      name: string;
      contactInfo: string;
      insuranceInfo: string;
    };
    thirdPartyInvolved: boolean;
    type: string;
  };

  documents: DocumentAttachment[];
}

// Add request types for claim actions
export interface ApproveClaimRequest {
  claimId: number;
  approvedAmount: number;
  notes?: string;
}

export interface RejectClaimRequest {
  claimId: number;
  rejectionReason: string;
  notes?: string;
}

export interface UpdateClaimStatusRequest {
  claimId: number;
  status: string;
  claimAmount?: number;
  reason?: string;
}
