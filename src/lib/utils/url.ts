import { config } from '../config';

export function absolutizeUrl(url: unknown): string | undefined {
  if (!url) return undefined;
  
  let candidate: string | undefined;
  
  if (typeof url === 'object' && url !== null && 'url' in url) {
    candidate = String((url as { url: string }).url);
  } else if (typeof url === 'string') {
    candidate = url;
  } else {
    return undefined;
  }
  
  if (!candidate || candidate === 'undefined' || candidate === 'null') {
    return undefined;
  }
  
  if (/^https?:\/\//i.test(candidate)) {
    return candidate;
  }
  
  if (!config.apiBaseUrl) {
    return candidate;
  }
  
  const path = candidate.startsWith('/') ? candidate : `/${candidate}`;
  return `${config.apiBaseUrl}${path}`;
}

