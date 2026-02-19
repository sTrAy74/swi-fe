export type UserRole = 'customer' | 'provider' | 'admin';

export interface RegisterCustomerPayload {
  full_name: string;
  email: string;
  password: string;
  role: 'customer';
  profile: {
    phone_number: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface RegisterResponse {
  message?: string;
}

export interface RegisterProviderPayload {
  full_name: string;
  email: string;
  password: string;
  role: 'provider';
  profile: {
    phone_number: string;
    business_name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    experience_years: number;
    about: string;
    services: number[];
  };
}

export interface ProviderProfile {
  id: number;
  documentId: string;
  full_name: string;
  phone_number: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  business_name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  experience_years: number;
  profile_type: string;
  verified: boolean;
  average_rating: number;
  review_count: number;
  about: string;
}

export interface RegisterProviderResponse {
  message: string;
  jwt: string;
  user: LoginResponseUser;
  profile: ProviderProfile;
}

export interface LoginPayload {
  identifier: string; // email or username
  password: string;
}

export interface LoginResponseUser {
  id: number;
  email: string;
  role: UserRole | 'customer' | 'provider';
}

export interface LoginResponse {
  message: string;
  jwt: string;
  user: LoginResponseUser;
}


