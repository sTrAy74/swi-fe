import { createDefaultHttpClient } from './http';
import { HttpError } from './http';
import { getApiErrorMessage } from './errors';

const http = createDefaultHttpClient();

export interface CustomerProfile {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ProviderProfile {
  id: number;
  full_name: string;
  email: string;
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
  cover_photo?: string;
  logo?: string;
  certifications?: string[];
  portfolio_images?: string[];
}

export async function getCustomerProfile(): Promise<CustomerProfile> {
  try {
    const response = await http.request<{ profile?: CustomerProfile } | CustomerProfile>({
      method: 'GET',
      path: '/api/custom-auth/profile',
    });
    return (response as { profile?: CustomerProfile }).profile || (response as CustomerProfile);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new Error(getApiErrorMessage(error, 'Failed to fetch profile'));
  }
}

export async function getProviderProfile(): Promise<ProviderProfile> {
  try {
    const response = await http.request<{ profile?: ProviderProfile } | ProviderProfile>({
      method: 'GET',
      path: '/api/custom-auth/profile',
    });
    return (response as { profile?: ProviderProfile }).profile || (response as ProviderProfile);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new Error(getApiErrorMessage(error, 'Failed to fetch profile'));
  }
}

export async function updateProfile(formData: FormData): Promise<ProviderProfile> {
  try {
    const response = await http.request<{ profile?: ProviderProfile } | ProviderProfile>({
      method: 'PATCH',
      path: '/api/custom-auth/profile',
      body: formData as unknown,
      headers: {}, // Let browser set Content-Type for FormData
    });
    return (response as { profile?: ProviderProfile }).profile || (response as ProviderProfile);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new Error(getApiErrorMessage(error, 'Failed to update profile'));
  }
}

