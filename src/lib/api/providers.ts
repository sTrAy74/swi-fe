import { createDefaultHttpClient } from './http';

const http = createDefaultHttpClient();

export interface ProviderService {
  id: number;
  title: 'Installation' | 'Consultation' | 'Maintenance' | string;
  description?: unknown;
}

export interface ProviderCertification {
  id: number;
  url: string;
  name: string;
}

export interface ProviderLogo {
  id: number;
  name: string;
  url: string;
}

export interface ProviderCoverPhoto {
  id: number;
  name: string;
  url: string;
}

export interface ProviderListItem {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  business_name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  experience_years: number;
  about: string;
  profile_type: 'provider' | string;
  avg_rating: number | null;
  certifications: ProviderCertification[];
  services: ProviderService[];
  logo?: ProviderLogo | null;
  cover_photo?: ProviderCoverPhoto | null;
}

export interface ProvidersListMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  filtersUsed?: Record<string, unknown>;
}

export interface ProvidersListResponse {
  meta: ProvidersListMeta;
  data: ProviderListItem[];
}

export interface ProvidersQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  city?: string;
  state?: string;
  min_experience?: number;
  max_experience?: number;
  min_rating?: number;
  max_rating?: number;
  services?: 'Installation' | 'Consultation' | 'Maintenance' | string;
  service?: 'Installation' | 'Consultation' | 'Maintenance' | string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

function toQueryString(params: Record<string, unknown>): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    usp.set(key, String(value));
  });
  return usp.toString();
}

export async function fetchProviders(params: ProvidersQuery = {}, signal?: AbortSignal): Promise<ProvidersListResponse> {
  const { services, service, ...rest } = params || {};
  const effectiveService = service ?? services;
  const query = toQueryString({ ...rest, service: effectiveService });
  const path = `/api/custom-auth/providers${query ? `?${query}` : ''}`;
  return await http.request<ProvidersListResponse>({ path, method: 'GET', signal });
}

export interface ProviderServiceDetail {
  id: number;
  title: string;
  description: unknown[];
  price: number;
}

export interface ProviderReview {
  id?: number;
  rating?: number;
  comment?: string;
  user?: {
    id: number;
    username?: string;
  };
  createdAt?: string;
}

export interface ProviderUser {
  id: number;
  username: string;
}

export interface ProviderDetailData {
  id: number;
  full_name: string;
  business_name: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  experience_years: number;
  about: string;
  profile_type: string;
  average_rating: number;
  total_reviews: number;
  logo: ProviderLogo | null;
  cover_photo: ProviderCoverPhoto | null;
  certifications: ProviderCertification[];
  portfolio_images: unknown[];
  services: ProviderServiceDetail[];
  user: ProviderUser;
  reviews: ProviderReview[];
}

export interface ProviderDetailResponse {
  data: ProviderDetailData;
}

export async function fetchProvider(id: number | string, signal?: AbortSignal): Promise<ProviderDetailResponse> {
  const path = `/api/custom-auth/providers/${id}`;
  return await http.request<ProviderDetailResponse>({ path, method: 'GET', signal });
}


