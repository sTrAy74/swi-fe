import { config } from '../config';
import { getToken, clearToken } from '../auth/token';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpClientOptions {
  baseUrl: string;
  getToken?: () => string | null;
  onUnauthorized?: () => void;
}

export interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  path: string;
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class HttpError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

function sanitizeErrorMessage(message: string, status: number): string {
  if (config.isProduction) {
    if (status >= 500) {
      return 'An internal server error occurred. Please try again later.';
    }
    if (status === 401) {
      return 'Authentication required. Please log in.';
    }
    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (status === 404) {
      return 'The requested resource was not found.';
    }
    if (status >= 400 && status < 500) {
      return 'Invalid request. Please check your input and try again.';
    }
  }
  
  return message || 'Request failed';
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly getToken?: () => string | null;
  private readonly onUnauthorized?: () => void;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.getToken = options.getToken;
    this.onUnauthorized = options.onUnauthorized;
  }

  async request<TResponse = unknown, TBody = unknown>(options: RequestOptions<TBody>): Promise<TResponse> {
    const { method = 'GET', path, body, headers = {}, signal } = options;
    const url = `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

    const token = this.getToken ? this.getToken() : null;
    const finalHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    if (body instanceof FormData) {
      delete finalHeaders['Content-Type'];
    }
    
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
      signal,
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        clearToken();
        if (this.onUnauthorized) {
          this.onUnauthorized();
        }
      }
      
      const rawMessage = (isJson && data && typeof data === 'object' && 'message' in data && typeof data.message === 'string' 
        ? data.message 
        : response.statusText) || 'Request failed';
      const sanitizedMessage = sanitizeErrorMessage(rawMessage, response.status);
      throw new HttpError(sanitizedMessage, response.status, data);
    }

    return data as TResponse;
  }
}

export const createDefaultHttpClient = () => {
  return new HttpClient({
    baseUrl: config.apiBaseUrl,
    getToken: () => getToken(),
  });
};


