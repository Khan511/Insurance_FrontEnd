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

export type ProductType =
  | "AUTO"
  // | "HEALTH"
  | "LIFE"
  | "PROPERTY";
// | "TRAVEL"
// | "LIABILITY"
// | "PET";

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
  policiyHolderName: string;
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

  premium: number;
  currency: string;
  paymentFrequency: string; // 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
  paymentSchedules: PaymentSchedule[];

  beneficiaries: Beneficiaries[];
};

//PaymentSchedule type
export type PaymentSchedule = {
  id: number;
  dueAmount: number;
  currency: string;
  dueDate: string;
  paidDate: string | null;
  status: string; // 'PENDING' | 'PAID' | 'OVERDUE'
  transactionId: string;
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
  dateOfBirth?: Date;
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
