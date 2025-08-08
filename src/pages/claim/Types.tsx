export const CLAIM_DOCUMENT_TYPES = {
  CHOOSE: "Choose claim type",
  AUTOMOBILE_COLLISION: "AUTOMOBILE_COLLISION",
  HEALTH_HOSPITALIZATION: "HEALTH_HOSPITALIZATION",
  CYBER_INCIDENT: "CYBER_INCIDENT",
  HOME_DAMAGE: "HOME_DAMAGE",
} as const;

export const RequiredDocument = {
  POLICE_REPORT: "POLICE_REPORT",
  REPAIR_ESTIMATE: "REPAIR_ESTIMATE",
  MEDICAL_BILLS: "MEDICAL_BILLS",
  DOCTOR_REPORT: "DOCTOR_REPORT",
  DEATH_CERTIFICATE: "DEATH_CERTIFICATE",
  INCIDENT_REPORT: "INCIDENT_REPORT",
  FORENSIC_AUDIT: "FORENSIC_AUDIT",
  PROPERTY_DAMAGE_REPORT: "PROPERTY_DAMAGE_REPORT",
  ESTIMATE: "ESTIMATE",
  INVENTORY_LIST: "INVENTORY_LIST",
  BENEFICIARY_DOCS: "BENEFICIARY_DOCS",
} as const;

export const INCIDENT_TYPES = {
  CHOOSE: "Choose incident type",
  ACCIDENT: "ACCIDENT",
  THEFT: "THEFT",
  NATURAL_DISASTER: "NATURAL_DISASTER",
  MEDICAL_EMERGENCY: "MEDICAL_EMERGENCY",
  CYBER_ATTACK: "CYBER_ATTACK",
  FIRE: "FIRE",
  BURGLARY: "BURGLARY",
  WATER_DAMAGE: "WATER_DAMAGE",
} as const;

export type RequiredDocumentType =
  (typeof RequiredDocument)[keyof typeof RequiredDocument];

export const INCIDENT_TYPES_MAP: Record<ClaimDocumentType, IncidentType[]> = {
  [CLAIM_DOCUMENT_TYPES.CHOOSE]: [],
  [CLAIM_DOCUMENT_TYPES.AUTOMOBILE_COLLISION]: [
    INCIDENT_TYPES.ACCIDENT,
    INCIDENT_TYPES.THEFT,
  ],
  [CLAIM_DOCUMENT_TYPES.HEALTH_HOSPITALIZATION]: [
    INCIDENT_TYPES.MEDICAL_EMERGENCY,
  ],
  [CLAIM_DOCUMENT_TYPES.CYBER_INCIDENT]: [INCIDENT_TYPES.CYBER_ATTACK],
  [CLAIM_DOCUMENT_TYPES.HOME_DAMAGE]: [
    INCIDENT_TYPES.NATURAL_DISASTER,
    INCIDENT_TYPES.FIRE,
    INCIDENT_TYPES.BURGLARY,
    INCIDENT_TYPES.WATER_DAMAGE,
  ],
};

export const DOCUMENT_TYPE_MAP: Record<
  ClaimDocumentType,
  RequiredDocumentType[]
> = {
  [CLAIM_DOCUMENT_TYPES.CHOOSE]: [],
  [CLAIM_DOCUMENT_TYPES.AUTOMOBILE_COLLISION]: [
    RequiredDocument.POLICE_REPORT,
    RequiredDocument.REPAIR_ESTIMATE,
  ],
  [CLAIM_DOCUMENT_TYPES.HEALTH_HOSPITALIZATION]: [
    RequiredDocument.MEDICAL_BILLS,
    RequiredDocument.DOCTOR_REPORT,
  ],
  [CLAIM_DOCUMENT_TYPES.CYBER_INCIDENT]: [
    RequiredDocument.INCIDENT_REPORT,
    RequiredDocument.FORENSIC_AUDIT,
  ],
  [CLAIM_DOCUMENT_TYPES.HOME_DAMAGE]: [
    RequiredDocument.PROPERTY_DAMAGE_REPORT,
    RequiredDocument.ESTIMATE,
    RequiredDocument.INVENTORY_LIST,
  ],
};
// Create type definition
export type ClaimDocumentType =
  (typeof CLAIM_DOCUMENT_TYPES)[keyof typeof CLAIM_DOCUMENT_TYPES];
export type IncidentType = (typeof INCIDENT_TYPES)[keyof typeof INCIDENT_TYPES];

// Form types
export type Address = {
  street: string;
  city: string;
  // state: string;
  postalCode: string;
  country: string;
};

export type ThirdPartyDetails = {
  name: string;
  contactInfo: string;
  insuranceInfo: string;
};

export type DocumentAttachment = {
  storageId: string;
  storageBucket: string;
  originalFileName: string;
  contentType: string;
  sha256Checksum: string;
  documentType: RequiredDocumentType;
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
  documents: DocumentAttachment[];
};
