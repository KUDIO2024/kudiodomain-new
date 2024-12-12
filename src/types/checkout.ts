export type PaymentMethod = "card";
export type EmailPlan = "basic" | "standard" | "business" | null;
export type WebsitePackage = "lite" | "pro" | "premium" | null;

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
}

export interface DomainDetails {
  name: string;
  extension: string;
  available: boolean;
  price: number;
}

export interface CheckoutState {
  userDetails: UserDetails;
  domain: DomainDetails | null;
  emailPlan: EmailPlan;
  websitePackage: WebsitePackage;
  isYearlyWebsite?: boolean;
  paymentMethod: PaymentMethod | null;
  currentStep: number;
  customerId: number;
  paymentStatus: number;
}
