export const CLAIM_DOCUMENT_TYPES = {
  AUTOMOBILE_COLLISION: "AUTOMOBILE_COLLISION",
  HEALT_HOSPITALIZATION: "HEALT_HOSPITALIZATION",
  CYBER_INCIDENT: "CYBER_INCIDENT",
  OTHER: "OTHER",
} as const;

export const INCIDENT_TYPES = {
  ACCIDENT: "ACCIDENT",
  THEFT: "THEFT",
  NATURAL_DISASTER: "NATURAL_DISASTER",
  MEDICAL_EMERGENCY: "MEDICAL_EMERGENCY",
  CYBER_ATTACK: "CYBER_ATTACK",
} as const;

// Create type definition
export type ClaimDocumentType =
  (typeof CLAIM_DOCUMENT_TYPES)[keyof typeof CLAIM_DOCUMENT_TYPES];
export type IncidentType = (typeof INCIDENT_TYPES)[keyof typeof INCIDENT_TYPES];

// Form types
export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type ThirdPartyDetails = {
  name: string;
  contactInfo: string;
  insuranceInfo: string;
};

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
};
