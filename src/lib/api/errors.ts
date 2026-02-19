import { HttpError } from './http';
import { config } from '../config';

function sanitizeErrorString(message: string): string {
  if (config.isProduction) {
    return message
      .split('\n')[0] // Only first line
      .replace(/at\s+.*/g, '') // Remove stack trace lines
      .replace(/file:\/\/\/.*/g, '') // Remove file paths
      .trim();
  }
  return message;
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof HttpError) {
    const data = error.data;
    if (data && typeof data === 'object') {
      if ('message' in data && typeof data.message === 'string' && data.message.trim().length > 0) {
        return sanitizeErrorString(data.message);
      }
      if ('error' in data) {
        if (typeof data.error === 'string' && data.error.trim().length > 0) {
          return sanitizeErrorString(data.error);
        }
        if (data.error && typeof data.error === 'object' && 'message' in data.error && typeof data.error.message === 'string' && data.error.message.trim().length > 0) {
          return sanitizeErrorString(data.error.message);
        }
      }
      if ('errors' in data && Array.isArray(data.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        if (typeof first === 'string') {
          return sanitizeErrorString(first);
        }
        if (first && typeof first === 'object' && 'message' in first && typeof first.message === 'string') {
          return sanitizeErrorString(first.message);
        }
      }
    }
    if (error.message) {
      return sanitizeErrorString(error.message);
    }
    return `${fallback} (HTTP ${error.status})`;
  }

  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return sanitizeErrorString(error.message);
  }
  
  if (config.isDevelopment) {
    try {
      return JSON.stringify(error);
    } catch {
    }
  }
  
  return fallback;
}


