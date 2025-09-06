import { validate, validateStrict, isValid } from '../core/validators';
import { ValidationOptions } from '../types';

describe('Phone Number Validation', () => {
  describe('validate function', () => {
    test('should validate correct Pakistani mobile numbers', () => {
      const validNumbers = [
        '03001234567',
        '0300 123 4567',
        '+92 300 1234567',
        '+923001234567',
        '923001234567',
        '03101234567', // Zong
        '03301234567', // Ufone
        '03401234567', // Telenor
        '03551234567', // SCO
      ];

      validNumbers.forEach(number => {
        expect(validate(number)).toBe(true);
      });
    });

    test('should validate Urdu digit phone numbers', () => {
      const urduNumbers = [
        '۰۳۰۰۱۲۳۴۵۶۷',
        '۰۳۰۰ ۱۲۳ ۴۵۶۷',
        '+۹۲ ۳۰۰ ۱۲۳۴۵۶۷',
        '۰۳۱۰۱۲۳۴۵۶۷', // Zong
        '۰۳۳۰۱۲۳۴۵۶۷', // Ufone
        '۰۳۴۰۱۲۳۴۵۶۷', // Telenor
      ];

      urduNumbers.forEach(number => {
        expect(validate(number)).toBe(true);
      });
    });

    test('should validate mixed digit phone numbers', () => {
      const mixedNumbers = ['۰3۰0123456۷', '0300۱۲3456۷', '+92 3۰۰ 1234567'];

      mixedNumbers.forEach(number => {
        expect(validate(number)).toBe(true);
      });
    });

    test('should reject invalid Pakistani mobile numbers', () => {
      const invalidNumbers = [
        '03001234', // too short
        '030012345678', // too long
        '02001234567', // invalid prefix
        '04001234567', // invalid prefix
        '1234567890', // no country code or leading zero
        '+1234567890', // wrong country code
        '+9230012345', // too short with country code
        '', // empty
        'abc', // non-numeric
        '03001234abc', // mixed characters
        '+923001234abc', // mixed with country code
      ];

      invalidNumbers.forEach(number => {
        expect(validate(number)).toBe(false);
      });
    });

    test('should handle different formatting styles', () => {
      const sameNumber = [
        '03001234567',
        '0300 123 4567',
        '0300-123-4567',
        '0300.123.4567',
        '0300 1234567',
        '+92 300 1234567',
        '+92-300-1234567',
        '+92.300.1234567',
        '+923001234567',
      ];

      sameNumber.forEach(number => {
        expect(validate(number)).toBe(true);
      });
    });

    test('should handle edge cases', () => {
      expect(validate('  03001234567  ')).toBe(true); // whitespace
      expect(validate('+92(300)1234567')).toBe(true); // parentheses
      expect(validate('0300-123-4567')).toBe(true); // dashes
      expect(validate('0300.123.4567')).toBe(true); // dots
    });
  });

  describe('validateStrict function', () => {
    test('should return detailed validation result for valid numbers', () => {
      const result = validateStrict('03001234567');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.phoneNumber).toBeDefined();
      expect(result.phoneNumber?.operator?.code).toBe('JAZZ');
    });

    test('should return detailed error information for invalid numbers', () => {
      const result = validateStrict('0200123456');

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.phoneNumber).toBeUndefined();
    });

    test('should respect validation options', () => {
      const options: ValidationOptions = {
        strictMode: true,
        allowInternational: true,
      };

      const result1 = validateStrict('+923001234567', options);
      expect(result1.isValid).toBe(true);

      const result2 = validateStrict('0300 123 4567', options);
      expect(result2.isValid).toBe(false); // strict mode
    });

    test('should handle empty input', () => {
      const result = validateStrict('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Phone number cannot be empty');
    });

    test('should detect multiple errors', () => {
      const result = validateStrict('abcd123');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('isValid function', () => {
    test('should return boolean for valid numbers', () => {
      expect(isValid('03001234567')).toBe(true);
      expect(isValid('+923001234567')).toBe(true);
      expect(isValid('0300 123 4567')).toBe(true);
    });

    test('should return false for invalid numbers', () => {
      expect(isValid('invalid')).toBe(false);
      expect(isValid('')).toBe(false);
      expect(isValid('123')).toBe(false);
    });

    test('should be consistent with validate function', () => {
      const testNumbers = [
        '03001234567',
        '+923001234567',
        '0300123456789', // invalid
        'invalid',
        '',
        '02001234567', // invalid prefix
      ];

      testNumbers.forEach(number => {
        expect(isValid(number)).toBe(validate(number));
      });
    });
  });

  describe('Performance tests', () => {
    test('should validate numbers efficiently', () => {
      const startTime = performance.now();
      const testNumbers = ['03001234567', '+923001234567', '0300 123 4567', 'invalid'];

      for (let i = 0; i < 1000; i++) {
        testNumbers.forEach(number => validate(number));
      }

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(300);
    });
  });

  describe('Edge cases and error conditions', () => {
    test('should handle null and undefined inputs', () => {
      // @ts-expect-error Testing null input
      expect(validate(null)).toBe(false);
      // @ts-expect-error Testing undefined input
      expect(validate(undefined)).toBe(false);
    });

    test('should handle non-string inputs gracefully', () => {
      // @ts-expect-error Testing number input
      expect(validate(3001234567)).toBe(false);
      // @ts-expect-error Testing object input
      expect(validate({})).toBe(false);
      // @ts-expect-error Testing array input
      expect(validate([])).toBe(false);
    });

    test('should handle very long strings', () => {
      const longString = '0'.repeat(1000) + '3001234567';
      expect(validate(longString)).toBe(false);
    });

    test('should handle unicode characters', () => {
      expect(validate('03001234567🔥')).toBe(false);
      expect(validate('０３００１２３４５６７')).toBe(false); // full-width numbers
    });

    test('should reject malicious inputs (security)', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        'onclick="alert(1)"',
        'eval(malicious)',
        'expression(bad)',
        '"><script>alert(1)</script>',
        '\x00\x01\x02\x03\x04', // null bytes and control characters
      ];

      maliciousInputs.forEach(input => {
        expect(validate(input)).toBe(false);
      });
    });

    test('should handle special characters and normalization', () => {
      expect(validate('\u202E03001234567\u202D')).toBe(true);
      expect(validate('0\u200B3\u200C0\u200D01234567')).toBe(true);
      expect(validate('0092300123456۷')).toBe(true);
      expect(validate('+92(300)1234567')).toBe(true);
      expect(validate('0300_123_4567')).toBe(true);
    });
  });
});
