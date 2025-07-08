// types.ts
export type PolicyStatus =
  | "DRAFT"
  | "ACTIVE"
  | "RENEWAL_PENDING"
  | "EXPIRED"
  | "CANCELLED"
  | "LAPSED";

export type PolicyPeriod = {
  effectiveDate: Date | null;
  expirationDate: Date | null;
};

export type MonetaryAmount = {
  amount: string;
  currency: string;
};

export type PolicyBeneficiary = {
  name: string;
  taxCountry: string;
  taxIdentifier: string;
};

export type CustomerPolicy = {
  policyHolder: string;
  product: string;
  coveragePeriod: PolicyPeriod;
  premium: MonetaryAmount;
  status: PolicyStatus;
  beneficiaries: PolicyBeneficiary[];
};
