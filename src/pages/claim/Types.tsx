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
  amount: string;
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

// In your Types.ts file
export interface ClaimApiResponse {
  claimNumber: string;
  claimType: string;
  status: string;
  amount?: string;
  incidentDetails: {
    description: string;
    incidentDateTime: [number, number, number, number?, number?]; // Tuple format
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
  policyNumber: string;
  documents: Array<{
    contentType: string;
    documentType: string;
    downloadUrl: string | null;
    fileKey: string | null;
    fileSize: number | null;
    fileUrl: string | null;
    originalFileName: string;
    sha256Checksum: string;
    storageBucket: string;
    storageId: string;
    storagePath: string | null;
    uploadedAt: string | null;
  }>;
}
