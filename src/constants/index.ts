/**
 * Centralized constants for Pakistani phone number utilities
 * Single source of truth for all constants used throughout the package
 */

/**
 * Core phone number constants
 */
export const PHONE_CONSTANTS = {
  COUNTRY_CODE: '92',
  LOCAL_PREFIX: '0',
  SUBSCRIBER_LENGTH: 7, // Always exactly 7 digits
  PREFIX_LENGTH: 3, // Mobile prefix length (300, 301, etc.)
} as const;

/**
 * Length validation constants
 */
export const LENGTH_CONSTANTS = {
  MOBILE_NATIONAL: 11, // 03001234567
  MOBILE_INTERNATIONAL_E164: 13, // +923001234567
  MOBILE_INTERNATIONAL_0092: 14, // 0092 300 1234567
  MOBILE_WITHOUT_PREFIX: 10, // 3001234567
  MIN_MOBILE_LENGTH: 10, // Minimum valid mobile length (without country code or leading zero)
  MAX_MOBILE_LENGTH: 14, // Maximum valid mobile length (with 0092)
} as const;

/**
 * Mobile prefix ranges for all Pakistani operators
 */
export const PREFIX_RANGES = {
  MOBILE_MIN: 300,
  MOBILE_MAX: 355,

  // Jazz (Mobilink) - 300-309, 320-329
  JAZZ_MIN: 300,
  JAZZ_MAX: 329,

  // Zong - 310-319
  ZONG_MIN: 310,
  ZONG_MAX: 319,

  // Ufone - 330-338
  UFONE_MIN: 330,
  UFONE_MAX: 338,

  // Onic - 339
  ONIC: 339,

  // Telenor - 340-349
  TELENOR_MIN: 340,
  TELENOR_MAX: 349,

  // SCO - 355
  SCO: 355,
} as const;

/**
 * Country information
 */
export const COUNTRY_INFO = {
  CODE: '92',
  ISO: 'PK',
  NAME: 'Pakistan',
  LOCAL_PREFIX: '0',
} as const;

/**
 * Urdu digit mappings
 */
export const URDU_DIGITS = {
  TO_ENGLISH: {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
  } as Record<string, string>,
  TO_URDU: {
    '0': '۰',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
  } as Record<string, string>,
} as const;

/**
 * Error messages for validation
 */
export const ERROR_MESSAGES = {
  INVALID_FORMAT: 'Invalid phone number format',
  INVALID_LENGTH: 'Invalid phone number length',
  INVALID_PREFIX: 'Invalid mobile operator prefix',
  INVALID_COUNTRY_CODE: 'Invalid country code',
  INVALID_SUBSCRIBER: 'Invalid subscriber number',
  EMPTY_INPUT: 'Phone number cannot be empty',
  INVALID_CHARACTERS: 'Phone number contains invalid characters',
  OPERATOR_NOT_FOUND: 'Mobile operator not found for this prefix',
} as const;
