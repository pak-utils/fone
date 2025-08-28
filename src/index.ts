/**
 * fone - Pakistani Phone Number Utilities
 *
 * A comprehensive, zero-dependency npm package for Pakistani phone number
 * validation, formatting, and operator detection.
 *
 * @author Sami Warraich
 * @license MIT
 */

// Core validation functions
export { validate, validateStrict, isValid, isMobile } from './core/validators';

// Core formatting functions
export {
  format,
  formatInternational,
  formatLocal,
  formatE164,
  formatCompact,
  formatCustom,
  convertFormat,
  matchesFormat,
  detectFormat,
  stripFormatting,
  ensureFormat,
} from './core/formatters';

// Operator detection functions
export {
  detectOperator,
  isOperator,
  isJazz,
  isZong,
  isUfone,
  isTelenor,
  isSCO,
  isOnic,
  getOperatorInfo,
  getSupportedOperators,
  isSupportedOperator,
  getOperatorStats,
  filterByOperator,
  groupByOperator,
  isPrefixOfOperator,
  getOperatorPrefixes,
} from './core/operators';

// Utility functions
export {
  parse,
  randomPhoneNumber,
  validateBatch,
  formatBatch,
  parseBatch,
  extractOperators,
  cleanBatch,
  convertBatch,
  filterValid,
  filterInvalid,
  isNumeric,
  digitsOnly,
  ensureCountryCode,
  removeCountryCode,
  isSameNumber,
  deduplicate,
  sortPhoneNumbers,
} from './utils/helpers';

export { normalizePhoneNumber as normalize } from './utils/digitUtils';

// Urdu digit utilities
export {
  urduToEnglishDigits,
  englishToUrduDigits,
  normalizeDigits,
  hasUrduDigits,
  hasOnlyValidDigits,
  sanitizePhoneInput,
  isSafePhoneInput,
} from './utils/digitUtils';

// Data exports
export {
  OPERATORS,
  getOperatorByPrefix,
  isValidMobilePrefix,
  getOperatorByCode,
  getAllOperatorCodes,
  getAllOperatorNames,
  OPERATOR_CONSTANTS,
} from './data/operators';

// Type exports
export type {
  FormatStyle,
  PhoneNumberType,
  OperatorInfo,
  OperatorData,
  PhoneNumber,
  ValidationOptions,
  ValidationResult,
  GeneratorOptions,
  CustomFormatOptions,
} from './types';

// Constants
export {
  PHONE_CONSTANTS,
  LENGTH_CONSTANTS,
  PREFIX_RANGES,
  COUNTRY_INFO,
  URDU_DIGITS,
  ERROR_MESSAGES,
} from './constants';

// Pattern exports for advanced users
export { PATTERNS, FORMAT_TEMPLATES } from './data/patterns';

import packageJson from '../package.json';

export const VERSION = packageJson.version;
export const packageInfo = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  author: packageJson.author,
  license: packageJson.license,
} as const;
