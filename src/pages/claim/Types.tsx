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

// EMPLOYEE TYPES
export type RoleType = "AGENT" | "CLAIM_MANAGER" | "ADMIN";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";

export interface PersonName {
  firstName: string;
  lastName: string;
}

export interface WorkContactInfo {
  workPhone?: string;
  workEmail?: string;
  // extension?: string;
  officeLocation?: string;
  // deskNumber?: string;
}

export interface EmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
  email?: string;
}

export interface EmployeeCreateDto {
  email: string;
  password: string;
  name: PersonName;
  dateOfBirth?: string;
  terminationDate?: string;
  department: string;
  jobTitle: string;
  salary: string;
  employmentType: EmploymentType;
  roleType: RoleType;
  workContactInfo?: WorkContactInfo;
  emergencyContact?: EmergencyContact;
}

export interface EmployeeResponseDto {
  id: number;
  employeeId: string;
  email: string;
  name: PersonName;
  dateOfBirth?: string;
  terminationDate?: string;
  department: string;
  jobTitle: string;
  salary: number;
  employmentType: EmploymentType;
  roleType: RoleType;
  workContactInfo?: WorkContactInfo;
  emergencyContact?: EmergencyContact;
  hireDate: string;
  active: boolean;
}
