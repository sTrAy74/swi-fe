import { createDefaultHttpClient } from './http';

const http = createDefaultHttpClient();

export interface CreateBookingPayload {
  providerId: number;
  services: number[];
  date: string;
  notes: string;
  address: string;
  location: string;
  price_at_booking: number;
  payment_status: 'pending';
  current_status: 'requested';
}

export interface CreateBookingResponse {
  data: {
    id: number;
    providerId: number;
    services: number[];
    date: string;
    notes: string;
    address: string;
    location: string;
    price_at_booking: number;
    payment_status: string;
    current_status: string;
  };
}

export async function createBooking(payload: CreateBookingPayload): Promise<CreateBookingResponse> {
  const path = '/api/custom-auth/book';
  return await http.request<CreateBookingResponse>({ path, method: 'POST', body: payload });
}

export interface BookingService {
  id: number;
  documentId: string;
  title: string;
  description: unknown[];
  price: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
}

export interface BookingProfile {
  id: number;
  documentId: string;
  full_name: string;
  phone_number: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
  business_name?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  experience_years?: number | null;
  profile_type: string;
  verified: boolean;
  average_rating: number;
  review_count: number;
  about?: string | null;
}

export interface BookingItem {
  createdAt: string;
  id: number;
  documentId: string;
  date: string;
  current_status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  price_at_booking: number;
  payment_status: string;
  location: string;
  address: string;
  services: BookingService[];
  provider: BookingProfile;
  customer: BookingProfile;
}

export interface MyBookingsResponse {
  message: string;
  count: number;
  bookings: BookingItem[];
}

export async function fetchMyBookings(signal?: AbortSignal): Promise<MyBookingsResponse> {
  const path = '/api/custom-auth/my-bookings';
  return await http.request<MyBookingsResponse>({ path, method: 'GET', signal });
}

export interface CreateReviewPayload {
  booking: number;
  rating: number;
  comment: string;
}

export interface CreateReviewResponse {
  message: string;
  data?: {
    id: number;
    booking: number;
    rating: number;
    comment: string;
  };
}

export async function createReview(payload: CreateReviewPayload): Promise<CreateReviewResponse> {
  const path = '/api/custom-auth/create-review';
  return await http.request<CreateReviewResponse>({ path, method: 'POST', body: payload });
}

