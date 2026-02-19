import { createDefaultHttpClient } from './http';
import { setToken, clearToken, getToken } from '../auth/token';
import type { LoginPayload, LoginResponse, RegisterCustomerPayload, RegisterResponse, RegisterProviderPayload, RegisterProviderResponse } from '../../types/auth';

const http = createDefaultHttpClient();

export async function registerCustomer(payload: RegisterCustomerPayload): Promise<RegisterResponse> {
  return http.request<RegisterResponse, RegisterCustomerPayload>({
    method: 'POST',
    path: '/api/custom-auth/register',
    body: payload,
  });
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await http.request<LoginResponse, LoginPayload>({
    method: 'POST',
    path: '/api/custom-auth/login',
    body: payload,
  });
  if (res?.jwt) {
    setToken(res.jwt);
  }
  return res;
}

export function logout(): void {
  clearToken();
}

export function getAuthToken(): string | null {
  return getToken();
}

export async function registerProvider(payload: RegisterProviderPayload): Promise<RegisterProviderResponse> {
  return http.request<RegisterProviderResponse, RegisterProviderPayload>({
    method: 'POST',
    path: '/api/custom-auth/register',
    body: payload,
  });
}


