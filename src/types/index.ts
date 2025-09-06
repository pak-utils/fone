/**
 * Format styles for phone number formatting
 */
export type FormatStyle =
  | 'national' // 0300 1234567
  | 'international' // +92 300 1234567
  | 'e164' // +923001234567
  | 'compact' // 03001234567
  | 'dots' // 0300.123.4567
  | 'dashes' // 0300-123-4567
  | 'parentheses'; // (0300) 1234567

/**
 * Operator information interface
 */
export interface OperatorInfo {
  readonly code: string;
  readonly name: string;
  readonly network?: string | undefined;
}

/**
 * Operator data structure
 */
export interface OperatorData extends OperatorInfo {
  readonly prefixes: readonly number[];
}

/**
 * Parsed phone number object
 */
export interface PhoneNumber {
  readonly raw: string; // Original input
  readonly formatted: string; // National format with spaces (e.g., "0300 1234567")
  readonly international: string; // International format (e.g., "+92 300 1234567")
  readonly operator: OperatorInfo | null;
  readonly isValid: boolean;
  readonly prefix: number | null;
  readonly subscriberNumber: string;
}

/**
 * Validation options
 */
export interface ValidationOptions {
  readonly strictMode?: boolean;
  readonly allowInternational?: boolean;
  readonly customPattern?: RegExp;
}

/**
 * Validation result
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
  readonly phoneNumber?: PhoneNumber | undefined;
}

/**
 * Generator options for random phone numbers
 */
export interface GeneratorOptions {
  readonly operator?: string;
  readonly format?: FormatStyle;
  readonly count?: number;
}

/**
 * Custom formatting options
 */
export interface CustomFormatOptions {
  readonly template?: (prefix: string, subscriber: string) => string;
  readonly pattern?: RegExp;
}
