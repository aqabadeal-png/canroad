

export type Page = 'Home' | 'Services' | 'Pricing' | 'Map' | 'Contact';

export type VehicleType = 'Car' | 'SUV' | 'Truck / Van';

// ServiceType can be one of the predefined or a new custom one
export type ServiceType =
  | 'generalMechanics'
  | 'tireChange'
  | 'diagnostics'
  | 'oilChange'
  | 'filterReplacement'
  | 'batteryBoost'
  | string;

export type UserRole = 'admin' | 'mechanic' | 'accounting' | 'customer';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  password?: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export interface MechanicLocation extends Omit<LocationData, 'address'> {
  updatedAt: Date;
  heading?: number;
  speed?: number;
}

export interface EstimateLineItem {
  label: string;
  amount: number;
  note?: string;
}

export interface PricingEstimate {
  totalMin: number;
  totalMax: number;
  etaMin: number;
  etaMax: number;
  breakdown: EstimateLineItem[];
  lockedUntil: number | null;
}

export type JobStatus = 'pending' | 'assigned' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  mechanicId: string | null;
  status: JobStatus;
  customerLocation: LocationData;
  createdAt: Date;
  initialEstimate: PricingEstimate;
  finalInvoice?: PricingEstimate;
  serviceType: ServiceType;
  vehicleType: VehicleType;
  vehicleMake?: string;
  vehicleModel?: string;
  isEvaluated: boolean;
  cancellationReason?: string;
  acceptanceAudio?: string;
  rating?: number;
}

export interface PricingInputs {
  location: LocationData | null;
  serviceType: ServiceType;
  vehicleType: VehicleType;
  promoCode: string;
  applyWeatherSurcharge: boolean;
}

export interface Service {
  id: ServiceType;
  title: string;
  description: string;
  icon: string; // Corresponds to a key in ICONS from constants.tsx
  basePrice: number;
}

export interface HomePageCard {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  isEnabled: boolean;
  isPrimary: boolean;
  comingSoon: boolean;
}

export interface ServiceArea {
  id: string;
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  radius: number; // in meters
}