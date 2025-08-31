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
  claimType: ClaimDocumentType;
  incidentDetails: {
    incidentDateTime: string;
    type: IncidentType;
    location: Address;
    description: string;
    policeReportNumber?: string;
    thirdPartyInvolved: boolean;
    thirdPartyDetails?: ThirdPartyDetails;
  };
  documents: DocumentAttachment[];
};
