export type MonetaryAmount = {
  amount: number;
  currency: string;
};

export type CoverageDetails = {
  coverageType: string;
  description: string;
  coverageLimit: MonetaryAmount;
  deductible: MonetaryAmount;
};

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type PolicyPeriod = {
  effectiveDate: string;
  expirationDate: string;
};

export type ProductTranslation = {
  displayName: string;
  description: string;
};

export type ProductType = "AUTO" | "LIFE" | "PROPERTY";

export type AgeBracket = {
  minAge?: number;
  maxAge?: number;
  multiplier?: number;
  factor?: number;
};

export type PremiumCalculationConfig = {
  formula?: string;
  factors?: Record<string, number>;
  basePremium?: MonetaryAmount;
  ageBrackets?: AgeBracket[];
  includeTax?: boolean;
  commissionRate?: number;
};

export type InsuracePolicy = {
  id: number;
  productCode: string;
  policyNumber: string;
  displayName: string;
  description: string;

  policyHolderName: string;
  policyHolderEmail: string;

  status: string;
  productType: ProductType;
  coverageDetails: CoverageDetails[];
  eligibilityRules: { [key: string]: string };
  targetAudience: string[];
  regions: string[];
  category: Category;
  validityPeriod: PolicyPeriod;
  allowedClaimTypes: string[];
  translation: { [locale: string]: ProductTranslation };
  calculationConfig?: PremiumCalculationConfig;

  // Financial fields
  premium: string;
  currency: string;
  paymentFrequency: string; // 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
  paymentSchedules: PaymentSchedule[];

  cancellationReason: string;
  cancellationDate: string | null;
  cancelledBy: string | null;
  statusChangeNotes: string | null;

  // Audit fields
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;

  // Relationship IDs
  userId: string | null;
  policyHolderId: number | null;
  productId: number | null;
  translations: Translations[];
  beneficiaries: Beneficiaries[];
};

type Translations = {
  displayName: string;
  description: string;
};
//PaymentSchedule type
export type PaymentSchedule = {
  [x: string]: unknown;
  id: number;
  dueAmount: number;
  currency: string;
  dueDate: string;
  paidDate: string | null;
  status: string; // 'PENDING' | 'PAID' | 'OVERDUE'
  transactionId: string;

  cancellationDate: string | null;
  cancelledBy: string | null;
  policyId?: number;
};

export type GovernmentId = {
  // idType?: number;
  idType?: string;
  idNumber: string;
  issuingCountry: string;
  // expirationDate?: string;
  expirationDate?: Date;
};

export type Address = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

export type ContactInfo = {
  phone: string;
  alternatePhone?: string | undefined;
  primaryAddress: Address;
  billingAddress: Address;
};

export type Beneficiaries = {
  name: string;
  relationship: string;
  dateOfBirth?: Date | string;
  // taxCountry: string;
  // taxIdentifier: string;
};

export type CoveragePeriod = {
  effectiveDate: Date | null | undefined;
};
export type Customer = {
  userId?: string;
  governmentId: GovernmentId;
  contactInfo: ContactInfo;
};
export type BuyPolicyFormValues = {
  productId?: string;
  status: string;

  // Risk factor
  vehicleValue?: number | undefined;
  drivingExperience?: number | undefined;
  healthCondition?: string;
  propertyValue?: number | undefined;
  propertyLocation?: string;
  paymentFrequency: string;

  customer: Customer;
  // product: string;
  coveragePeriod: CoveragePeriod;
  beneficiaries?: Beneficiaries[];
};

export type PremiumCalculationRequest = {
  productId: number;
  riskFactors: {
    vehicleValue?: number;
    drivingExperience?: number;
    healthCondition?: string;
    propertyValue?: number;
    propertyLocation?: string;
    // age?: number;
  };
  paymentFrequency: string;
};

export type PremiumCalculationResponse = {
  amount: number;
  currency: string;
  installmentAmount: number;
  paymentFrequency: string;
  formulaUsed: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UserResponse = {
  timeStamp: string;
  status: number;
  path: string;

  message: string;
  data: {
    user: {
      userId: string;
      email: string;
      createdAt: string;
      name: {
        firstName: string;
        lastName: string;
      };
      roles: string[];
      permissions: string[];
    };
  };
};
export type CreateUserRequest = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
} & LoginRequest;

export type CreateUserResponse = {
  timeStamp: string;
  status: number;
  path: string;
  message: string;
};

export type ResendVerificationRequest = {
  email: string;
};

export type EmailVerificationResponse = {
  message: string;
  email: string;
  timestamp: string;
};

// ERROR
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errorCode: string;
  path: string;
  traceId?: string;
  fieldErrors?: Record<string, string>;
  subErrors?: SubError[];
}

export interface SubError {
  field: string;
  message: string;
  rejectedValue?: any;
}

export interface RTKQueryError {
  status: number;
  data: ApiError;
}

// Type guard to check if error is ApiError
export const isApiError = (error: any): error is RTKQueryError => {
  return (
    error && typeof error === "object" && "data" in error && "status" in error
  );
};

// Error code mappings for user-friendly messages
export const ERROR_MESSAGES: Record<string, string> = {
  // Authentication
  INVALID_CREDENTIALS: "The email or password you entered is incorrect",
  ACCOUNT_DISABLED: "Your account has been disabled. Please contact support.",
  ACCOUNT_LOCKED:
    "Your account is locked. Please try again later or contact support.",
  ACCOUNT_EXPIRED: "Your account has expired. Please contact support.",
  CREDENTIALS_EXPIRED: "Your password has expired. Please reset it.",
  ACCESS_DENIED: "You do not have permission to access this resource",

  // Validation
  VALIDATION_ERROR: "Please check your input and try again",
  INVALID_INPUT: "Some fields contain invalid data",

  // Business
  RESOURCE_NOT_FOUND: "The requested resource was not found",
  DUPLICATE_RESOURCE: "This resource already exists",

  // System
  INTERNAL_ERROR: "An unexpected error occurred. Please try again.",
  SERVICE_UNAVAILABLE: "Service is temporarily unavailable",
};

// Chat bot Types
export interface ChatMessageRequest {
  message: string;
  conversationId?: string;
  context?: string;
}

export interface ChatMessageResponse {
  response: string;
  fromAI: boolean;
  timestamp?: string;
  conversationId?: string;
}

// Reset password
// Add these interfaces
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ValidateResetTokenRequest {
  token: string;
}

export interface ValidateResetTokenResponse {
  valid: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}
