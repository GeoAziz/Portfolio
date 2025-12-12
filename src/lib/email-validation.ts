/**
 * Email Validation Utilities
 */

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Sanitize email (trim and lowercase)
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Validate and sanitize email
 */
export function validateAndSanitizeEmail(email: string): {
  valid: boolean;
  email?: string;
  error?: string;
} {
  const sanitized = sanitizeEmail(email);

  if (!sanitized) {
    return { valid: false, error: 'Email is required' };
  }

  if (!isValidEmail(sanitized)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true, email: sanitized };
}
