import { OperatorInfo } from '../types';
import { getOperatorByPrefix, isValidMobilePrefix, OPERATORS } from '../data/operators';
import { PATTERNS } from '../data/patterns';
import { validate } from './validators';

/**
 * Detects the mobile operator from a Pakistani phone number
 * @param phone - The phone number to analyze
 * @returns Operator information or null if not found/invalid
 */
export function detectOperator(phone: string): OperatorInfo | null {
  if (!validate(phone)) {
    return null;
  }

  const prefix = extractMobilePrefix(phone);
  if (prefix === null) {
    return null;
  }

  const operatorData = getOperatorByPrefix(prefix);
  if (!operatorData) {
    return null;
  }

  return {
    code: operatorData.code,
    name: operatorData.name,
    type: operatorData.type,
    network: operatorData.network || undefined,
  };
}

/**
 * Checks if a phone number belongs to a specific operator
 * @param phone - The phone number to check
 * @param operatorCode - The operator code to check against (e.g., 'JAZZ', 'ZONG')
 * @returns True if the number belongs to the specified operator
 */
export function isOperator(phone: string, operatorCode: string): boolean {
  const operator = detectOperator(phone);
  return operator?.code.toLowerCase() === operatorCode.toLowerCase();
}

/**
 * Checks if a phone number belongs to Jazz network
 * @param phone - The phone number to check
 * @returns True if Jazz number, false otherwise
 */
export function isJazz(phone: string): boolean {
  return isOperator(phone, 'JAZZ');
}

/**
 * Checks if a phone number belongs to Zong network
 * @param phone - The phone number to check
 * @returns True if Zong number, false otherwise
 */
export function isZong(phone: string): boolean {
  return isOperator(phone, 'ZONG');
}

/**
 * Checks if a phone number belongs to Ufone network
 * @param phone - The phone number to check
 * @returns True if Ufone number, false otherwise
 */
export function isUfone(phone: string): boolean {
  return isOperator(phone, 'UFONE');
}

/**
 * Checks if a phone number belongs to Telenor network
 * @param phone - The phone number to check
 * @returns True if Telenor number, false otherwise
 */
export function isTelenor(phone: string): boolean {
  return isOperator(phone, 'TELENOR');
}

/**
 * Checks if a phone number belongs to SCO network
 * @param phone - The phone number to check
 * @returns True if SCO number, false otherwise
 */
export function isSCO(phone: string): boolean {
  return isOperator(phone, 'SCO');
}

/**
 * Checks if a phone number belongs to Onic network
 * @param phone - The phone number to check
 * @returns True if Onic number, false otherwise
 */
export function isOnic(phone: string): boolean {
  return isOperator(phone, 'ONIC');
}

/**
 * Gets operator information with additional metadata
 * @param phone - The phone number to analyze
 * @returns Extended operator information or null
 */
export function getOperatorInfo(phone: string): (OperatorInfo & { prefix: number }) | null {
  const operator = detectOperator(phone);
  const prefix = extractMobilePrefix(phone);

  if (!operator || prefix === null) {
    return null;
  }

  return {
    ...operator,
    prefix,
  };
}

/**
 * Gets all possible operators for validation/filtering purposes
 * @returns Array of all supported operators
 */
export function getSupportedOperators(): readonly OperatorInfo[] {
  return [
    { code: 'JAZZ', name: 'Jazz', type: 'mobile', network: 'GSM' },
    { code: 'ZONG', name: 'Zong', type: 'mobile', network: 'GSM' },
    { code: 'UFONE', name: 'Ufone', type: 'mobile', network: 'GSM' },
    { code: 'ONIC', name: 'Onic', type: 'mobile', network: 'GSM' },
    { code: 'TELENOR', name: 'Telenor', type: 'mobile', network: 'GSM' },
    { code: 'SCO', name: 'Special Communications Organization', type: 'mobile', network: 'GSM' },
  ] as const;
}

/**
 * Checks if an operator code is supported
 * @param operatorCode - The operator code to check
 * @returns True if supported, false otherwise
 */
export function isSupportedOperator(operatorCode: string): boolean {
  const supportedCodes = getSupportedOperators().map(op => op.code.toLowerCase());
  return supportedCodes.includes(operatorCode.toLowerCase());
}

/**
 * Gets operator statistics for a list of phone numbers
 * @param phoneNumbers - Array of phone numbers to analyze
 * @returns Object with operator distribution statistics
 */
export function getOperatorStats(phoneNumbers: string[]): Record<string, number> {
  const stats: Record<string, number> = {};

  // Initialize stats for all operators
  getSupportedOperators().forEach(operator => {
    stats[operator.code] = 0;
  });

  stats['UNKNOWN'] = 0;

  // Count occurrences
  phoneNumbers.forEach(phone => {
    const operator = detectOperator(phone);
    if (operator) {
      stats[operator.code] = (stats[operator.code] || 0) + 1;
    } else {
      stats['UNKNOWN'] = (stats['UNKNOWN'] || 0) + 1;
    }
  });

  return stats;
}

/**
 * Filters phone numbers by operator
 * @param phoneNumbers - Array of phone numbers to filter
 * @param operatorCode - The operator code to filter by
 * @returns Array of phone numbers belonging to the specified operator
 */
export function filterByOperator(phoneNumbers: string[], operatorCode: string): string[] {
  return phoneNumbers.filter(phone => isOperator(phone, operatorCode));
}

/**
 * Groups phone numbers by their operators
 * @param phoneNumbers - Array of phone numbers to group
 * @returns Object with operator codes as keys and arrays of numbers as values
 */
export function groupByOperator(phoneNumbers: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};

  // Initialize groups for all operators
  getSupportedOperators().forEach(operator => {
    groups[operator.code] = [];
  });
  groups['UNKNOWN'] = [];

  // Group numbers
  phoneNumbers.forEach(phone => {
    const operator = detectOperator(phone);
    if (operator) {
      if (!groups[operator.code]) groups[operator.code] = [];
      groups[operator.code]!.push(phone);
    } else {
      if (!groups['UNKNOWN']) groups['UNKNOWN'] = [];
      groups['UNKNOWN'].push(phone);
    }
  });

  return groups;
}

/**
 * Extracts the mobile prefix from a phone number
 * @param phone - The phone number
 * @returns The 3-digit prefix or null if not found
 */
function extractMobilePrefix(phone: string): number | null {
  if (!phone || typeof phone !== 'string') {
    return null;
  }

  try {
    // Clean the phone number
    const cleaned = phone.replace(PATTERNS.CLEAN.FORMATTING, '');

    // Extract prefix using regex
    const match = cleaned.match(PATTERNS.PREFIX.MOBILE);
    if (match && match[1]) {
      const prefix = parseInt(match[1], 10);
      return isValidMobilePrefix(prefix) ? prefix : null;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validates that a prefix belongs to a specific operator
 * @param prefix - The prefix to check
 * @param operatorCode - The operator code
 * @returns True if the prefix belongs to the operator
 */
export function isPrefixOfOperator(prefix: number, operatorCode: string): boolean {
  const operator = getOperatorByPrefix(prefix);
  return operator?.code.toLowerCase() === operatorCode.toLowerCase();
}

/**
 * Gets all prefixes for a specific operator
 * @param operatorCode - The operator code
 * @returns Array of prefixes or empty array if operator not found
 */
export function getOperatorPrefixes(operatorCode: string): readonly number[] {
  const supportedOperators = getSupportedOperators();
  const operator = supportedOperators.find(
    op => op.code.toLowerCase() === operatorCode.toLowerCase()
  );

  if (!operator) {
    return [];
  }

  // Find the operator data by code directly
  const operatorData = OPERATORS.find(op => op.code === operator.code);
  if (operatorData) {
    return operatorData.prefixes;
  }

  // Fallback: search through valid mobile prefix range
  const prefixes: number[] = [];
  for (let prefix = 300; prefix <= 355; prefix++) {
    if (isPrefixOfOperator(prefix, operatorCode)) {
      prefixes.push(prefix);
    }
  }

  return prefixes;
}
