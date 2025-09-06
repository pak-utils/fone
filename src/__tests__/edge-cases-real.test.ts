/**
 * Real edge case tests to improve coverage for genuine scenarios
 */

import { validate, validateStrict, isMobile } from '../core/validators';
import { format, stripFormatting, matchesFormat, ensureFormat } from '../core/formatters';
import { detectOperator, getOperatorInfo, getOperatorPrefixes } from '../core/operators';
import { parse, randomPhoneNumber } from '../utils/helpers';
import { normalizePhoneNumber, sanitizePhoneInput } from '../utils/digit-utils';

describe('Edge Cases and Exception Handling', () => {
  describe('Validation with custom patterns', () => {
    test('should validate with custom pattern successfully', () => {
      const result = validateStrict('1234567890', {
        customPattern: /^\d{10}$/,
      });

      expect(result.isValid).toBe(true);
      expect(result.phoneNumber?.operator).toBeNull();
      expect(result.phoneNumber?.raw).toBe('1234567890');
    });

    test('should fail validation with custom pattern', () => {
      const result = validateStrict('invalid-input', {
        customPattern: /^\d{10}$/,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Phone number does not match custom pattern');
    });

    test('should handle international format restrictions', () => {
      const result = validateStrict('+923001234567', {
        allowInternational: false,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('International format not allowed');
    });
  });

  describe('Exception handling in core functions', () => {
    test('should handle malformed input objects gracefully', () => {
      const malformedInput = Object.create(null);
      malformedInput.toString = () => {
        throw new Error('toString error');
      };

      // These should not throw exceptions
      expect(validate(malformedInput as any)).toBe(false);
      expect(parse(malformedInput as any)).toBeNull();
      expect(detectOperator(malformedInput as any)).toBeNull();
      expect(isMobile(malformedInput as any)).toBe(false);
      expect(matchesFormat(malformedInput as any, 'national')).toBe(false);
      expect(stripFormatting(malformedInput as any)).toBe('');

      const strictResult = validateStrict(malformedInput as any);
      expect(strictResult.isValid).toBe(false);
      expect(strictResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Format normalization edge cases', () => {
    test('should handle 0092 country code format', () => {
      const result = format('00923001234567', 'national');
      expect(result).toBe('0300 1234567');
    });

    test('should handle plain 92 country code format', () => {
      const result = format('923001234567', 'international');
      expect(result).toBe('+92 300 1234567');
    });

    test('should handle malformed international formats', () => {
      expect(() => format('+92300123456', 'national')).toThrow(); // too short
      expect(() => format('92300123456', 'national')).toThrow(); // too short without +
    });
  });

  describe('Operator detection edge cases', () => {
    test('should return null for invalid prefixes', () => {
      expect(detectOperator('02001234567')).toBeNull(); // invalid prefix
      expect(detectOperator('')).toBeNull(); // empty string
      expect(detectOperator('abc')).toBeNull(); // non-numeric
    });

    test('should handle getOperatorInfo with invalid numbers', () => {
      expect(getOperatorInfo('invalid-number')).toBeNull();
      expect(getOperatorInfo('')).toBeNull();
    });

    test('should return empty array for invalid operators', () => {
      const result = getOperatorPrefixes('INVALID_OPERATOR');
      expect(result).toEqual([]);
    });
  });

  describe('Helper function edge cases', () => {
    test('should handle null and undefined in parse', () => {
      expect(parse(null as any)).toBeNull();
      expect(parse(undefined as any)).toBeNull();
      expect(parse('12345')).toBeNull(); // too short
    });

    test('should handle edge cases in randomPhoneNumber', () => {
      // Zero count
      const result1 = randomPhoneNumber({ count: 0 });
      expect(Array.isArray(result1)).toBe(true);
      expect(result1).toHaveLength(0);

      // Negative count
      const result2 = randomPhoneNumber({ count: -5 });
      expect(Array.isArray(result2)).toBe(true);
      expect(result2).toHaveLength(0);

      // Invalid operator
      const result3 = randomPhoneNumber({ operator: 'NONEXISTENT', count: 1 }) as string;
      expect(typeof result3).toBe('string');
      expect(validate(result3)).toBe(true); // Should still generate a valid number
    });
  });

  describe('Digit utilities edge cases', () => {
    test('should handle null inputs in normalizePhoneNumber', () => {
      expect(normalizePhoneNumber(null as any)).toBe('');
      expect(normalizePhoneNumber(undefined as any)).toBe('');
      expect(normalizePhoneNumber('')).toBe('');
    });

    test('should handle edge cases in sanitizePhoneInput', () => {
      expect(sanitizePhoneInput(null as any)).toBe('');
      expect(sanitizePhoneInput(undefined as any)).toBe('');
      expect(sanitizePhoneInput('')).toBe('');

      // Test length limiting
      const longInput = 'a'.repeat(100);
      const result = sanitizePhoneInput(longInput);
      expect(result.length).toBe(30); // Should be truncated for DoS protection
    });
  });

  describe('Format safety and error recovery', () => {
    test('should use ensureFormat for safe formatting', () => {
      // Should format valid numbers
      expect(ensureFormat('03001234567')).toBe('0300 1234567');
      expect(ensureFormat('03001234567', 'international')).toBe('+92 300 1234567');

      // Should return original for invalid numbers (not throw)
      expect(ensureFormat('invalid-number')).toBe('invalid-number');
      expect(ensureFormat('')).toBe('');
      expect(ensureFormat('abc')).toBe('abc');
    });
  });

  describe('Real world scenario tests', () => {
    test('should handle common user input mistakes', () => {
      const commonMistakes = [
        '0300-123-4567', // dashes
        '0300.123.4567', // dots
        '(0300) 1234567', // parentheses
        '0300 123 4567', // extra spaces
        '+92 300 123 4567', // international with spaces
      ];

      commonMistakes.forEach(input => {
        expect(validate(input)).toBe(true);
        const formatted = format(input, 'national');
        expect(formatted).toBe('0300 1234567');
      });
    });

    test('should handle various input formats correctly', () => {
      // Test different valid input formats that should all work
      const validFormats = ['03001234567', '0300-123-4567', '(0300) 1234567', '+92 300 1234567'];

      validFormats.forEach(input => {
        expect(validate(input)).toBe(true);
        const parsed = parse(input);
        expect(parsed?.operator?.code).toBe('JAZZ');
      });
    });

    test('should maintain consistency across all operations', () => {
      const testNumber = '03001234567';

      // Parse -> format -> parse should be consistent
      const parsed1 = parse(testNumber);
      expect(parsed1).not.toBeNull();

      const formatted = format(testNumber, 'international');
      const parsed2 = parse(formatted);

      expect(parsed1?.operator?.code).toBe(parsed2?.operator?.code);
      expect(parsed1?.subscriberNumber).toBe(parsed2?.subscriberNumber);
    });
  });
});
