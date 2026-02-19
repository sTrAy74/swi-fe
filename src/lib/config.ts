function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      console.error('NEXT_PUBLIC_API_URL is required in production');
    }
    return '';
  }
  return url.replace(/\/$/, '');
}

export const config = {
  apiBaseUrl: getApiBaseUrl(),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

