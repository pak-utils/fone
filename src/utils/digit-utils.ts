import { URDU_DIGITS, LENGTH_CONSTANTS } from '../constants';
import { PATTERNS } from '../data/patterns';

/**
 * Converts Urdu digits to English digits
 * @param input - String containing Urdu digits
 * @returns String with English digits
 */
export function urduToEnglishDigits(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input.replace(PATTERNS.CLEAN.URDU_DIGITS, match => {
    return URDU_DIGITS.TO_ENGLISH[match] || match;
  });
}

/**
 * Converts English digits to Urdu digits
 * @param input - String containing English digits
 * @returns String with Urdu digits
 */
export function englishToUrduDigits(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input.replace(/[0-9]/g, match => {
    return URDU_DIGITS.TO_URDU[match] || match;
  });
}

/**
 * Normalizes digits in a string (converts Urdu to English)
 * @param input - Input string with mixed digits
 * @returns String with normalized English digits
 */
export function normalizeDigits(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return urduToEnglishDigits(input);
}

/**
 * Checks if a string contains Urdu digits
 * @param input - String to check
 * @returns True if contains Urdu digits
 */
export function hasUrduDigits(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  return PATTERNS.CLEAN.URDU_DIGITS.test(input);
}

/**
 * Checks if a string contains only valid digits (English or Urdu)
 * @param input - String to check
 * @returns True if contains only valid digits
 */
export function hasOnlyValidDigits(input: string): boolean {
  if (typeof input !== 'string') {
    return false;
  }

  // Empty string should return true (contains only valid digits - none)
  if (input.length === 0) {
    return true;
  }

  // Remove all valid digits and check if anything remains
  const withoutDigits = input.replace(/[0-9]/g, '').replace(PATTERNS.CLEAN.URDU_DIGITS, '');

  return withoutDigits.length === 0;
}

/**
 * Sanitizes input for phone number processing
 * @param input - Raw input string
 * @returns Sanitized string ready for validation
 */
export function sanitizePhoneInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Convert Urdu digits to English first
  let sanitized = urduToEnglishDigits(input.trim());

  // Remove RTL/LTR override characters and zero-width characters
  sanitized = sanitized.replace(/[\u202A-\u202E\u200B-\u200D]/g, '');

  // Remove excessive whitespace
  sanitized = sanitized.replace(PATTERNS.CLEAN.MULTIPLE_SPACES, ' ');

  // Basic security: limit length to prevent DoS - allow some extra for formatted input
  if (sanitized.length > 30) {
    sanitized = sanitized.substring(0, 30);
  }

  return sanitized;
}

/**
 * Validates that input contains only safe characters for phone numbers
 * @param input - Input to validate
 * @returns True if input is safe
 */
export function isSafePhoneInput(input: string): boolean {
  if (typeof input !== 'string') {
    return false;
  }

  // Empty string is safe
  if (input.length === 0) {
    return true;
  }

  // Check for potentially problematic patterns
  const problematicPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\(/i,
    /expression\(/i,
    /data:/i,
    /vbscript:/i,
    /&#/i,
    /&lt;/i,
    /&gt;/i,
    /style\s*=/i,
  ];

  return !problematicPatterns.some(pattern => pattern.test(input));
}

/**
 * Normalizes a Pakistani phone number to a standard format (03001234567)
 * @param phone - The phone number to normalize
 * @returns Normalized phone number or empty string if invalid
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  try {
    // Sanitize input first
    const sanitized = sanitizePhoneInput(phone);
    if (!sanitized) {
      return '';
    }

    // Convert Urdu digits to English
    let cleaned = normalizeDigits(sanitized);

    // Remove all formatting characters except + and digits
    cleaned = cleaned.replace(PATTERNS.CLEAN.NON_DIGITS, '');

    // Handle international format
    if (cleaned.startsWith('+92')) {
      cleaned = '0' + cleaned.substring(3);
    } else if (cleaned.startsWith('92') && cleaned.length >= 12) {
      // Handle 923001234567 format
      cleaned = '0' + cleaned.substring(2);
    } else if (cleaned.startsWith('0092')) {
      // Handle 00923001234567 format
      cleaned = '0' + cleaned.substring(4);
    }

    // Ensure it starts with 0 and has correct length for mobile
    if (!cleaned.startsWith('0')) {
      return '';
    }

    // Remove extra characters if too long
    if (cleaned.length > LENGTH_CONSTANTS.MOBILE_NATIONAL) {
      return '';
    }

    // Check if it's a valid mobile length
    if (cleaned.length !== LENGTH_CONSTANTS.MOBILE_NATIONAL) {
      return '';
    }

    return cleaned;
  } catch {
    return '';
  }
}
