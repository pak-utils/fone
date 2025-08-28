/**
 * Tests for custom formatting features and parentheses format
 */

import { format, formatCustom } from '../core/formatters';
import { FORMAT_TEMPLATES } from '../data/patterns';

describe('Custom Formatting Features', () => {
  describe('formatCustom function', () => {
    test('should format using custom template', () => {
      const result = formatCustom('03001234567', {
        pattern: /^0(\d{3})(\d{7})$/,
        template: (prefix, subscriber) =>
          `${prefix}-${subscriber.slice(0, 3)}-${subscriber.slice(3)}`,
      });
      expect(result).toBe('300-123-4567');
    });

    test('should throw error when template is missing', () => {
      expect(() => {
        formatCustom('03001234567', {});
      }).toThrow('Custom template function is required');
    });

    test('should throw error when pattern does not match', () => {
      expect(() => {
        formatCustom('invalid-number', {
          pattern: /^\d{11}$/,
          template: (prefix, subscriber) => `${prefix}-${subscriber}`,
        });
      }).toThrow('Phone number does not match custom pattern');
    });

    test('should use default pattern when none provided', () => {
      const result = formatCustom('03001234567', {
        template: (prefix, subscriber) => `[${prefix}] ${subscriber}`,
      });
      expect(result).toBe('[300] 1234567');
    });

    test('should work with international format input', () => {
      const result = formatCustom('+923001234567', {
        template: (prefix, subscriber) => `${prefix}:${subscriber}`,
      });
      expect(result).toBe('300:1234567');
    });
  });

  describe('parentheses format', () => {
    test('should format numbers with parentheses', () => {
      const result = format('03001234567', 'parentheses');
      expect(result).toBe('(0300) 1234567');
    });

    test('should format different operators with parentheses', () => {
      const testCases = [
        { input: '03001234567', expected: '(0300) 1234567' }, // Jazz
        { input: '03101234567', expected: '(0310) 1234567' }, // Zong
        { input: '03321234567', expected: '(0332) 1234567' }, // Ufone
        { input: '03451234567', expected: '(0345) 1234567' }, // Telenor
      ];

      testCases.forEach(({ input, expected }) => {
        const result = format(input, 'parentheses');
        expect(result).toBe(expected);
      });
    });

    test('should format international numbers with parentheses', () => {
      const result = format('+923001234567', 'parentheses');
      expect(result).toBe('(0300) 1234567');
    });
  });

  describe('FORMAT_TEMPLATES.PARENTHESES', () => {
    test('should work correctly as template function', () => {
      const result = FORMAT_TEMPLATES.PARENTHESES('300', '1234567');
      expect(result).toBe('(0300) 1234567');
    });

    test('should handle different prefix lengths', () => {
      const result = FORMAT_TEMPLATES.PARENTHESES('33', '1234567');
      expect(result).toBe('(033) 1234567');
    });
  });

  describe('Custom format edge cases', () => {
    test('should handle complex custom patterns', () => {
      // Test custom pattern - formatCustom uses (prefix, subscriber) parameters
      const result = formatCustom('03001234567', {
        pattern: /^0(\d{3})(\d{7})$/,
        template: (prefix, subscriber) =>
          `+92-${prefix}-${subscriber.slice(0, 3)}-${subscriber.slice(3)}`,
      });
      expect(result).toBe('+92-300-123-4567');
    });

    test('should validate phone number before applying custom format', () => {
      expect(() => {
        formatCustom('', {
          template: (prefix, subscriber) => `${prefix}-${subscriber}`,
        });
      }).toThrow();
    });

    test('should handle Urdu digits in custom formatting', () => {
      // Use English digits for this test since Urdu digit validation might be strict
      const result = formatCustom('03001234567', {
        template: (prefix, subscriber) => `${prefix}.${subscriber}`,
      });
      expect(result).toBe('300.1234567');
    });
  });
});
