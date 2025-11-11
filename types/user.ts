
export type UserRole = 'customer' | 'hauler';

export type HaulerStatus = 
  | 'pending_background_check'
  | 'background_check_in_progress'
  | 'background_check_approved'
  | 'background_check_denied'
  | 'pending_documents'
  | 'documents_submitted'
  | 'pending_onboarding'
  | 'active'
  | 'suspended';

export type SubscriptionTier = 'free' | 'pro' | 'premier';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: Date;
}

export interface Customer extends User {
  role: 'customer';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface Hauler extends User {
  role: 'hauler';
  status: HaulerStatus;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date;
  businessName?: string;
  serviceAreas?: string[];
  driversLicenseUrl?: string;
  vehicleRegistrationUrl?: string;
  insuranceUrl?: string;
  backgroundCheckId?: string;
  backgroundCheckStatus?: string;
}

export interface SubscriptionTierInfo {
  id: SubscriptionTier;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  serviceAreasAllowed: string;
  features: string[];
  color: string;
}
