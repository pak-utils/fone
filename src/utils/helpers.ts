import { PhoneNumber, OperatorInfo, GeneratorOptions, FormatStyle } from '../types';
import { OPERATORS } from '../data/operators';
import { validate } from '../core/validators';
import { format } from '../core/formatters';
import { detectOperator } from '../core/operators';
import { normalizePhoneNumber } from './digitUtils';
import { extractPrefix, extractSubscriber } from './phoneUtils';

/**
 * Parses a Pakistani phone number into a structured object
 * @param phone - The phone number to parse
 * @returns Parsed phone number object or null if invalid
 */
export function parse(phone: string): PhoneNumber | null {
  if (!validate(phone)) {
    return null;
  }

  try {
    const normalized = normalizePhoneNumber(phone);
    if (!normalized) {
      return null;
    }

    const prefix = extractPrefix(normalized);
    const subscriberNumber = extractSubscriber(normalized);
    const operator = detectOperator(normalized);

    if (prefix === null || !subscriberNumber) {
      return null;
    }

    return {
      raw: phone,
      formatted: format(normalized, 'national'),
      international: format(normalized, 'international'),
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


/**
 * Generates a random Pakistani mobile phone number
 * @param options - Generation options
 * @returns Random phone number(s) in the specified format
 */
export function randomPhoneNumber(options: GeneratorOptions = {}): string | string[] {
  const { operator, format: formatStyle = 'national', count = 1 } = options;

  const generateSingle = (): string => {
    try {
      // Select operator
      let selectedOperator = OPERATORS[0]; // Default to Jazz

      if (operator) {
        const found = OPERATORS.find(op => op.code.toLowerCase() === operator.toLowerCase());
        if (found) {
          selectedOperator = found;
        }
      } else {
        // Random operator selection
        const randomIndex = Math.floor(Math.random() * OPERATORS.length);
        selectedOperator = OPERATORS[randomIndex];
      }

      // Ensure we have a valid operator
      if (
        !selectedOperator ||
        !selectedOperator.prefixes ||
        selectedOperator.prefixes.length === 0
      ) {
        selectedOperator = OPERATORS[0]; // Fallback to Jazz
      }

      // Random prefix from the selected operator
      const randomPrefixIndex = Math.floor(Math.random() * selectedOperator!.prefixes.length);
      const randomPrefix = selectedOperator!.prefixes[randomPrefixIndex];

      // Generate random subscriber number (7 digits)
      const subscriberNumber = Math.floor(1000000 + Math.random() * 9000000).toString();

      // Create the basic number in national format
      const basicNumber = `0${randomPrefix}${subscriberNumber}`;

      // Validate the generated number before formatting
      if (!basicNumber || !validate(basicNumber)) {
        // Fallback to a known valid pattern
        return format('03001234567', formatStyle);
      }

      // Format according to specified style
      return format(basicNumber, formatStyle);
    } catch (error) {
      // Fallback to a known valid number
      return format('03001234567', formatStyle);
    }
  };

  if (count === 1) {
    return generateSingle();
  }

  const numbers: string[] = [];
  for (let i = 0; i < count; i++) {
    numbers.push(generateSingle());
  }

  return numbers;
}

/**
 * Validates multiple phone numbers at once
 * @param phoneNumbers - Array of phone numbers to validate
 * @returns Array of validation results
 */
export function validateBatch(phoneNumbers: string[]): boolean[] {
  return phoneNumbers.map(phone => validate(phone));
}

/**
 * Formats multiple phone numbers at once
 * @param phoneNumbers - Array of phone numbers to format
 * @param formatStyle - The desired format style
 * @returns Array of formatted phone numbers (or original if invalid)
 */
export function formatBatch(
  phoneNumbers: string[],
  formatStyle: FormatStyle = 'national'
): string[] {
  return phoneNumbers.map(phone => {
    try {
      return format(phone, formatStyle);
    } catch {
      return phone; // Return original if formatting fails
    }
  });
}

/**
 * Parses multiple phone numbers at once
 * @param phoneNumbers - Array of phone numbers to parse
 * @returns Array of parsed phone number objects (null for invalid numbers)
 */
export function parseBatch(phoneNumbers: string[]): (PhoneNumber | null)[] {
  return phoneNumbers.map(phone => parse(phone));
}

/**
 * Extracts unique operators from a list of phone numbers
 * @param phoneNumbers - Array of phone numbers
 * @returns Array of unique operator information
 */
export function extractOperators(phoneNumbers: string[]): OperatorInfo[] {
  const operatorSet = new Set<string>();
  const operators: OperatorInfo[] = [];

  phoneNumbers.forEach(phone => {
    const operator = detectOperator(phone);
    if (operator && !operatorSet.has(operator.code)) {
      operatorSet.add(operator.code);
      operators.push(operator);
    }
  });

  return operators;
}

/**
 * Cleans and normalizes multiple phone numbers
 * @param phoneNumbers - Array of phone numbers to clean
 * @returns Array of cleaned phone numbers
 */
export function cleanBatch(phoneNumbers: string[]): string[] {
  return phoneNumbers.map(phone => normalizePhoneNumber(phone)).filter(phone => phone !== '');
}

/**
 * Converts phone numbers between different formats
 * @param phoneNumbers - Array of phone numbers
 * @param targetFormat - Target format style
 * @returns Array of converted phone numbers
 */
export function convertBatch(phoneNumbers: string[], targetFormat: FormatStyle): string[] {
  return formatBatch(phoneNumbers, targetFormat);
}

/**
 * Filters valid phone numbers from an array
 * @param phoneNumbers - Array of phone numbers to filter
 * @returns Array containing only valid phone numbers
 */
export function filterValid(phoneNumbers: string[]): string[] {
  return phoneNumbers.filter(phone => validate(phone));
}

/**
 * Filters invalid phone numbers from an array
 * @param phoneNumbers - Array of phone numbers to filter
 * @returns Array containing only invalid phone numbers
 */
export function filterInvalid(phoneNumbers: string[]): string[] {
  return phoneNumbers.filter(phone => !validate(phone));
}


/**
 * Checks if a string contains only digits
 * @param str - The string to check
 * @returns True if contains only digits, false otherwise
 */
export function isNumeric(str: string): boolean {
  return /^\d+$/.test(str);
}

/**
 * Removes all non-numeric characters from a string
 * @param str - The string to clean
 * @returns String with only digits
 */
export function digitsOnly(str: string): string {
  return str.replace(/\D/g, '');
}

/**
 * Adds country code to a local number if missing
 * @param phone - The phone number
 * @returns Phone number with country code
 */
export function ensureCountryCode(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) {
    return phone;
  }

  // If already has country code, return as is
  if (phone.includes('+92')) {
    return phone;
  }

  // Add country code to normalized number
  return '+92' + normalized.substring(1);
}

/**
 * Removes country code from an international number
 * @param phone - The phone number
 * @returns Phone number without country code (local format)
 */
export function removeCountryCode(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  return normalized || phone;
}

/**
 * Checks if two phone numbers are the same (regardless of format)
 * @param phone1 - First phone number
 * @param phone2 - Second phone number
 * @returns True if they represent the same number
 */
export function isSameNumber(phone1: string, phone2: string): boolean {
  const normalized1 = normalizePhoneNumber(phone1);
  const normalized2 = normalizePhoneNumber(phone2);

  return normalized1 !== '' && normalized2 !== '' && normalized1 === normalized2;
}

/**
 * Deduplicates an array of phone numbers
 * @param phoneNumbers - Array of phone numbers
 * @returns Array with duplicate phone numbers removed
 */
export function deduplicate(phoneNumbers: string[]): string[] {
  const seen = new Set<string>();
  return phoneNumbers.filter(phone => {
    const normalized = normalizePhoneNumber(phone);
    if (!normalized || seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
}

/**
 * Sorts phone numbers in a logical order (by operator, then by number)
 * @param phoneNumbers - Array of phone numbers to sort
 * @returns Sorted array of phone numbers
 */
export function sortPhoneNumbers(phoneNumbers: string[]): string[] {
  return [...phoneNumbers].sort((a, b) => {
    const normalizedA = normalizePhoneNumber(a);
    const normalizedB = normalizePhoneNumber(b);

    if (!normalizedA && !normalizedB) return 0;
    if (!normalizedA) return 1;
    if (!normalizedB) return -1;

    return normalizedA.localeCompare(normalizedB);
  });
}
