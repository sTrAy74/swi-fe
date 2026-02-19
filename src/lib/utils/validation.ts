export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

export function isValidPincode(pincode: string): boolean {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode.trim());
}

export function validatePassword(password: string): {
  valid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  message: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      strength: 'weak',
      message: 'Password must be at least 8 characters long',
    };
  }

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  if (strength < 3) {
    return {
      valid: false,
      strength: 'weak',
      message: 'Password is too weak. Use uppercase, lowercase, numbers, and special characters',
    };
  }

  if (strength === 3) {
    return {
      valid: true,
      strength: 'medium',
      message: 'Password strength: Medium',
    };
  }

  return {
    valid: true,
    strength: 'strong',
    message: 'Password strength: Strong',
  };
}

export function validateFile(file: File, options?: {
  maxSizeMB?: number;
  allowedTypes?: string[];
}): { valid: boolean; error?: string } {
  const maxSizeMB = options?.maxSizeMB ?? 5;
  const allowedTypes = options?.allowedTypes;

  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  if (allowedTypes && allowedTypes.length > 0) {
    const fileType = file.type || '';
    const fileName = file.name.toLowerCase();
    
    const isAllowed = allowedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.replace('/*', '');
        return fileType.startsWith(baseType);
      }
      return fileType === type || fileName.endsWith(type);
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (sanitizedName !== file.name) {
  }

  return { valid: true };
}

