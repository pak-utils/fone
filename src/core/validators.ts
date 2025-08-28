import { ValidationOptions, ValidationResult, PhoneNumber } from '../types';
import { PATTERNS } from '../data/patterns';
import { ERROR_MESSAGES, LENGTH_CONSTANTS } from '../constants';
import { isValidMobilePrefix, getOperatorByPrefix } from '../data/operators';
import {
  sanitizePhoneInput,
  isSafePhoneInput,
  normalizeDigits,
  normalizePhoneNumber,
} from '../utils/digitUtils';
import { extractPrefix } from '../utils/phoneUtils';

/**
 * Validates a Pakistani phone number
 * @param phone - The phone number to validate
 * @returns True if valid, false otherwise
 */
export function validate(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  try {
    // Security check
    if (!isSafePhoneInput(phone)) {
      return false;
    }

    // Sanitize and normalize input
    const sanitized = sanitizePhoneInput(phone);
    if (!sanitized) {
      return false;
    }

    // Normalize digits (convert Urdu to English)
    const normalized = normalizeDigits(sanitized);

    // Remove formatting characters - get pure digits only
    const cleanPhone = normalized.replace(PATTERNS.CLEAN.FORMATTING, '');
    
    // Check length - max 14 digits for any valid Pakistani mobile number (00923001234567)
    if (cleanPhone.length > LENGTH_CONSTANTS.MAX_MOBILE_LENGTH) {
      return false;
    }

    // Check if it matches any mobile pattern
    return PATTERNS.MOBILE.LOOSE.test(cleanPhone) && isValidPrefix(extractPrefix(cleanPhone));
  } catch {
    return false;
  }
}

/**
 * Performs strict validation with detailed error reporting
 * @param phone - The phone number to validate
 * @param options - Validation options
 * @returns Detailed validation result
 */
export function validateStrict(phone: string, options: ValidationOptions = {}): ValidationResult {
  const errors: string[] = [];

  // Check for empty input
  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    errors.push(ERROR_MESSAGES.EMPTY_INPUT);
    return { isValid: false, errors };
  }

  try {
    // If custom pattern is provided, use it instead of default validation
    if (options.customPattern) {
      const isValid = options.customPattern.test(phone);
      if (!isValid) {
        errors.push('Phone number does not match custom pattern');
        return { isValid: false, errors };
      }
      // For custom patterns, we can't parse detailed phone info, so return basic success
      return {
        isValid: true,
        errors: [],
        phoneNumber: {
          raw: phone,
          formatted: phone,
          international: phone,
          local: phone,
          operator: null,
          isValid: true,
          type: 'mobile',
          prefix: null,
          subscriberNumber: phone,
        },
      };
    }

    const cleanPhone = phone.replace(PATTERNS.CLEAN.FORMATTING, '');

    // Check length - max 14 digits for any valid Pakistani mobile number
    if (cleanPhone.length > LENGTH_CONSTANTS.MAX_MOBILE_LENGTH) {
      errors.push(ERROR_MESSAGES.INVALID_LENGTH);
    }

    // Check for invalid characters
    if (!/^[\d+]+$/.test(cleanPhone)) {
      errors.push(ERROR_MESSAGES.INVALID_CHARACTERS);
    }

    // Try to parse the number
    const parsedNumber = parsePhoneNumber(phone);

    if (!parsedNumber) {
      errors.push(ERROR_MESSAGES.INVALID_FORMAT);
      return { isValid: false, errors };
    }

    // Validate based on options
    if (options.strictMode && hasFormatting(phone)) {
      errors.push('Strict mode requires no formatting characters');
    }

    if (!options.allowInternational && phone.includes('+')) {
      errors.push('International format not allowed');
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      phoneNumber: isValid ? parsedNumber : undefined,
    };
  } catch {
    errors.push(ERROR_MESSAGES.INVALID_FORMAT);
    return { isValid: false, errors };
  }
}

/**
 * Simple boolean validation check
 * @param phone - The phone number to validate
 * @returns True if valid, false otherwise
 */
export function isValid(phone: string): boolean {
  return validate(phone);
}

/**
 * Checks if the number is a mobile number
 * @param phone - The phone number to check
 * @returns True if mobile, false otherwise
 */
export function isMobile(phone: string): boolean {
  if (!validate(phone)) {
    return false;
  }

  try {
    const prefix = extractPrefix(phone);
    return prefix !== null && isValidMobilePrefix(prefix);
  } catch {
    return false;
  }
}


/**
 * Checks if a prefix is valid for mobile numbers
 * @param prefix - The prefix to check
 * @returns True if valid, false otherwise
 */
function isValidPrefix(prefix: number | null): boolean {
  if (prefix === null) {
    return false;
  }

  return isValidMobilePrefix(prefix);
}

/**
 * Checks if the phone number has formatting characters
 * @param phone - The phone number to check
 * @returns True if has formatting, false otherwise
 */
function hasFormatting(phone: string): boolean {
  return PATTERNS.DETECTION.HAS_FORMATTING.test(phone);
}

/**
 * Parses a phone number into a structured object (placeholder)
 * This will be implemented when the parser module is created
 * @param phone - The phone number to parse
 * @returns Parsed phone number object or null
 */
function parsePhoneNumber(phone: string): PhoneNumber | null {
  // This is a placeholder implementation
  // The actual implementation will be in the parsing module

  if (!validate(phone)) {
    return null;
  }

  try {
    const cleanPhone = phone.replace(PATTERNS.CLEAN.FORMATTING, '');
    const normalized = normalizePhoneNumber(cleanPhone);
    const prefix = extractPrefix(normalized);

    if (prefix === null) {
      return null;
    }

    const subscriberMatch = normalized.match(/(\d{7})$/);
    const subscriberNumber = subscriberMatch?.[1] ?? '';
    const operatorData = getOperatorByPrefix(prefix);
    const operator = operatorData
      ? {
          code: operatorData.code,
          name: operatorData.name,
          type: 'mobile' as const,
        }
      : null;

    return {
      raw: phone,
      formatted: `0${prefix} ${subscriberNumber}`,
      international: `+92 ${prefix} ${subscriberNumber}`,
      local: `0${prefix} ${subscriberNumber}`,
      operator,
      isValid: true,
      type: 'mobile',
      prefix,
      subscriberNumber,
    };
  } catch {
    return null;
  }
}
