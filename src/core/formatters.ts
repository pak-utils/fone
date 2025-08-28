import { FormatStyle, CustomFormatOptions } from '../types';
import { PATTERNS, FORMAT_TEMPLATES } from '../data/patterns';
import { ERROR_MESSAGES } from '../constants';
import { validate } from './validators';
import { sanitizePhoneInput, normalizeDigits } from '../utils/digitUtils';

/**
 * Formats a Pakistani phone number according to the specified style
 * @param phone - The phone number to format
 * @param style - The desired format style (default: 'national')
 * @returns Formatted phone number
 * @throws Error if the phone number is invalid
 */
export function format(phone: string, style: FormatStyle = 'national'): string {
  if (!validate(phone)) {
    throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
  }

  const normalized = normalizeToComponents(phone);
  if (!normalized) {
    throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
  }

  const { prefix, subscriber } = normalized;

  switch (style) {
    case 'national':
      return FORMAT_TEMPLATES.NATIONAL(prefix, subscriber);
    case 'international':
      return FORMAT_TEMPLATES.INTERNATIONAL(prefix, subscriber);
    case 'e164':
      return FORMAT_TEMPLATES.E164(prefix, subscriber);
    case 'compact':
      return FORMAT_TEMPLATES.COMPACT(prefix, subscriber);
    case 'dots':
      return FORMAT_TEMPLATES.DOTS(prefix, subscriber);
    case 'dashes':
      return FORMAT_TEMPLATES.DASHES(prefix, subscriber);
    case 'parentheses':
      return FORMAT_TEMPLATES.PARENTHESES(prefix, subscriber);
    default:
      return FORMAT_TEMPLATES.NATIONAL(prefix, subscriber);
  }
}

/**
 * Formats a phone number to international format
 * @param phone - The phone number to format
 * @returns Formatted phone number in international format
 * @throws Error if the phone number is invalid
 */
export function formatInternational(phone: string): string {
  return format(phone, 'international');
}

/**
 * Formats a phone number to local/national format
 * @param phone - The phone number to format
 * @returns Formatted phone number in local format
 * @throws Error if the phone number is invalid
 */
export function formatLocal(phone: string): string {
  return format(phone, 'national');
}

/**
 * Formats a phone number to E.164 format
 * @param phone - The phone number to format
 * @returns Formatted phone number in E.164 format
 * @throws Error if the phone number is invalid
 */
export function formatE164(phone: string): string {
  return format(phone, 'e164');
}

/**
 * Formats a phone number using a custom template function
 * @param phone - The phone number to format
 * @param options - Custom formatting options
 * @returns Formatted phone number using custom template
 * @throws Error if the phone number is invalid
 */
export function formatCustom(phone: string, options: CustomFormatOptions): string {
  if (!options.template) {
    throw new Error('Custom template function is required');
  }

  // If custom pattern is provided, validate against it first
  if (options.pattern && !options.pattern.test(phone)) {
    throw new Error('Phone number does not match custom pattern');
  }

  // Otherwise, use standard validation
  if (!options.pattern && !validate(phone)) {
    throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
  }

  const normalized = normalizeToComponents(phone);
  if (!normalized) {
    throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
  }

  const { prefix, subscriber } = normalized;
  return options.template(prefix, subscriber);
}

/**
 * Formats a phone number to compact format (no spaces or separators)
 * @param phone - The phone number to format
 * @returns Formatted phone number in compact format
 * @throws Error if the phone number is invalid
 */
export function formatCompact(phone: string): string {
  return format(phone, 'compact');
}

/**
 * Normalizes a phone number and extracts prefix and subscriber components
 * @param phone - The phone number to normalize
 * @returns Object with prefix and subscriber, or null if invalid
 */
function normalizeToComponents(phone: string): { prefix: string; subscriber: string } | null {
  if (!phone || typeof phone !== 'string') {
    return null;
  }

  try {
    // Sanitize and normalize digits first
    const sanitized = sanitizePhoneInput(phone);
    let cleaned = normalizeDigits(sanitized);

    // Remove all formatting characters
    cleaned = cleaned.replace(PATTERNS.CLEAN.FORMATTING, '');

    // Handle different input formats
    if (PATTERNS.DETECTION.HAS_COUNTRY_CODE.test(cleaned)) {
      // International format: +923001234567
      const match = cleaned.match(PATTERNS.MOBILE.INTERNATIONAL);
      if (match && match[1] && match[2]) {
        return {
          prefix: match[1],
          subscriber: match[2],
        };
      }
    } else if (PATTERNS.DETECTION.HAS_LEADING_ZERO.test(cleaned)) {
      // National format: 03001234567
      const match = cleaned.match(PATTERNS.MOBILE.NATIONAL);
      if (match && match[1] && match[2]) {
        return {
          prefix: match[1],
          subscriber: match[2],
        };
      }
    } else if (/^0092/.test(cleaned)) {
      // Format like 0092 300 1234567
      const match = cleaned.match(PATTERNS.MOBILE.INTERNATIONAL);
      if (match && match[1] && match[2]) {
        return {
          prefix: match[1],
          subscriber: match[2],
        };
      }
    } else if (/^92/.test(cleaned)) {
      // Format like 923001234567 (without +)
      const withPlus = '+' + cleaned;
      const match = withPlus.match(PATTERNS.MOBILE.INTERNATIONAL);
      if (match && match[1] && match[2]) {
        return {
          prefix: match[1],
          subscriber: match[2],
        };
      }
    }

    // Try loose matching as fallback
    const looseMatch = cleaned.match(PATTERNS.MOBILE.LOOSE);
    if (looseMatch && looseMatch[1] && looseMatch[2]) {
      return {
        prefix: looseMatch[1],
        subscriber: looseMatch[2],
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Converts between different format styles
 * @param phone - The phone number to convert
 * @param fromStyle - The current format style
 * @param toStyle - The target format style
 * @returns Converted phone number
 * @throws Error if conversion fails
 */
export function convertFormat(
  phone: string,
  _fromStyle: FormatStyle,
  toStyle: FormatStyle
): string {
  // First normalize the input regardless of the stated format
  const normalized = normalizeToComponents(phone);
  if (!normalized) {
    throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
  }

  // Then format to the target style
  return format(`0${normalized.prefix}${normalized.subscriber}`, toStyle);
}

/**
 * Checks if a string matches a specific format style
 * @param phone - The phone number to check
 * @param style - The format style to check against
 * @returns True if matches the format, false otherwise
 */
export function matchesFormat(phone: string, style: FormatStyle): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  try {
    switch (style) {
      case 'national':
        return /^0\d{3} \d{7}$/.test(phone);
      case 'international':
        return /^\+92 \d{3} \d{7}$/.test(phone);
      case 'e164':
        return /^\+92\d{10}$/.test(phone);
      case 'compact':
        return /^0\d{10}$/.test(phone) && !phone.includes(' ');
      case 'dots':
        return /^0\d{3}\.\d{3}\.\d{4}$/.test(phone);
      case 'dashes':
        return /^0\d{3}-\d{3}-\d{4}$/.test(phone);
      case 'parentheses':
        return /^\(0\d{3}\) \d{7}$/.test(phone);
      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * Detects the current format style of a phone number
 * @param phone - The phone number to analyze
 * @returns The detected format style or null if unknown
 */
export function detectFormat(phone: string): FormatStyle | null {
  if (!phone || typeof phone !== 'string') {
    return null;
  }

  const formatStyles: FormatStyle[] = [
    'national',
    'international',
    'e164',
    'compact',
    'dots',
    'dashes',
    'parentheses',
  ];

  for (const style of formatStyles) {
    if (matchesFormat(phone, style)) {
      return style;
    }
  }

  return null;
}

/**
 * Strips all formatting from a phone number
 * @param phone - The phone number to strip formatting from
 * @returns Phone number with no formatting
 */
export function stripFormatting(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  try {
    let cleaned = phone.trim();

    // Remove all non-digit characters except +
    cleaned = cleaned.replace(/[^\d+]/g, '');

    // Convert international to national
    if (cleaned.startsWith('+92')) {
      cleaned = '0' + cleaned.substring(3);
    } else if (cleaned.startsWith('92') && cleaned.length === 12) {
      cleaned = '0' + cleaned.substring(2);
    }

    return cleaned;
  } catch {
    return '';
  }
}

/**
 * Applies consistent formatting to ensure valid structure
 * @param phone - The phone number to format
 * @param targetStyle - The desired format style
 * @returns Formatted phone number or original if formatting fails
 */
export function ensureFormat(phone: string, targetStyle: FormatStyle = 'national'): string {
  try {
    return format(phone, targetStyle);
  } catch {
    // Return original if formatting fails
    return phone;
  }
}
