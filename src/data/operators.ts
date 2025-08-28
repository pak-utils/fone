import { OperatorData } from '../types';

/**
 * Comprehensive Pakistani mobile operators data
 * Optimized for fast lookups and minimal memory footprint
 */
export const OPERATORS: readonly OperatorData[] = [
  {
    code: 'JAZZ',
    name: 'Jazz',
    type: 'mobile',
    network: 'GSM',
    prefixes: [
      300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 320, 321, 322, 323, 324, 325, 326, 327, 328,
      329,
    ],
  },
  {
    code: 'ZONG',
    name: 'Zong',
    type: 'mobile',
    network: 'GSM',
    prefixes: [310, 311, 312, 313, 314, 315, 316, 317, 318, 319],
  },
  {
    code: 'UFONE',
    name: 'Ufone',
    type: 'mobile',
    network: 'GSM',
    prefixes: [330, 331, 332, 333, 334, 335, 336, 337, 338],
  },
  {
    code: 'ONIC',
    name: 'Onic',
    type: 'mobile',
    network: 'GSM',
    prefixes: [339],
  },
  {
    code: 'TELENOR',
    name: 'Telenor',
    type: 'mobile',
    network: 'GSM',
    prefixes: [340, 341, 342, 343, 344, 345, 346, 347, 348, 349],
  },
  {
    code: 'SCO',
    name: 'Special Communications Organization',
    type: 'mobile',
    network: 'GSM',
    prefixes: [355],
  },
] as const;

/**
 * Fast lookup map for prefix to operator mapping
 * Pre-computed for O(1) lookups
 */
export const PREFIX_TO_OPERATOR_MAP = new Map<number, OperatorData>();

/**
 * Initialize the prefix lookup map
 */
function initializePrefixMap(): void {
  for (const operator of OPERATORS) {
    for (const prefix of operator.prefixes) {
      PREFIX_TO_OPERATOR_MAP.set(prefix, operator);
    }
  }
}

/**
 * Set of all valid mobile prefixes for fast validation
 */
export const VALID_MOBILE_PREFIXES = new Set<number>();

/**
 * Initialize valid prefixes set
 */
function initializeValidPrefixes(): void {
  for (const operator of OPERATORS) {
    for (const prefix of operator.prefixes) {
      VALID_MOBILE_PREFIXES.add(prefix);
    }
  }
}

/**
 * Operator lookup by code
 */
export const OPERATOR_BY_CODE = new Map<string, OperatorData>();

/**
 * Initialize operator by code map
 */
function initializeOperatorByCode(): void {
  for (const operator of OPERATORS) {
    OPERATOR_BY_CODE.set(operator.code, operator);
  }
}

/**
 * Initialize all lookup maps and sets
 */
initializePrefixMap();
initializeValidPrefixes();
initializeOperatorByCode();

/**
 * Get operator by prefix (O(1) lookup)
 */
export function getOperatorByPrefix(prefix: number): OperatorData | undefined {
  return PREFIX_TO_OPERATOR_MAP.get(prefix);
}

/**
 * Check if prefix is valid mobile prefix (O(1) lookup)
 */
export function isValidMobilePrefix(prefix: number): boolean {
  return VALID_MOBILE_PREFIXES.has(prefix);
}

/**
 * Get operator by code (O(1) lookup)
 */
export function getOperatorByCode(code: string): OperatorData | undefined {
  return OPERATOR_BY_CODE.get(code.toUpperCase());
}

/**
 * Get all operator codes
 */
export function getAllOperatorCodes(): readonly string[] {
  return Object.freeze(OPERATORS.map(op => op.code));
}

/**
 * Get all operator names
 */
export function getAllOperatorNames(): readonly string[] {
  return Object.freeze(OPERATORS.map(op => op.name));
}

/**
 * Export constants for external use
 */
export const OPERATOR_CONSTANTS = {
  TOTAL_OPERATORS: OPERATORS.length,
  TOTAL_PREFIXES: Array.from(VALID_MOBILE_PREFIXES).length,
  JAZZ_PREFIXES: OPERATORS.find(op => op.code === 'JAZZ')?.prefixes.length ?? 0,
  ZONG_PREFIXES: OPERATORS.find(op => op.code === 'ZONG')?.prefixes.length ?? 0,
  UFONE_PREFIXES: OPERATORS.find(op => op.code === 'UFONE')?.prefixes.length ?? 0,
  ONIC_PREFIXES: OPERATORS.find(op => op.code === 'ONIC')?.prefixes.length ?? 0,
  TELENOR_PREFIXES: OPERATORS.find(op => op.code === 'TELENOR')?.prefixes.length ?? 0,
  SCO_PREFIXES: OPERATORS.find(op => op.code === 'SCO')?.prefixes.length ?? 0,
} as const;
