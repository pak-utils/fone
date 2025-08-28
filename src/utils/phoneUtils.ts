/**
 * Shared phone number utility functions
 */

import { PATTERNS } from '../data/patterns';

/**
 * Extracts the 3-digit mobile prefix from a phone number
 * @param phone - The phone number
 * @returns The 3-digit prefix or null if not found
 */
export function extractPrefix(phone: string): number | null {
  try {
    const cleanPhone = phone.replace(PATTERNS.CLEAN.FORMATTING, '');
    const match = cleanPhone.match(PATTERNS.PREFIX.MOBILE);

    if (match && match[1]) {
      return parseInt(match[1], 10);
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Extracts the 7-digit subscriber number from a phone number
 * @param phone - The phone number  
 * @returns The 7-digit subscriber number or empty string if not found
 */
export function extractSubscriber(phone: string): string {
  try {
    const match = phone.match(/0\d{3}(\d{7})/);
    return match?.[1] ?? '';
  } catch {
    return '';
  }
}