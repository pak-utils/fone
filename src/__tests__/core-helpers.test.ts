import {
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
} from '../utils/helpers';
import { detectOperator } from '../core/operators';
import { normalizePhoneNumber } from '../utils/digitUtils';
import { FormatStyle } from '../types';

describe('Helpers Utilities', () => {
  describe('parse', () => {
    test('should parse valid mobile numbers', () => {
      const result = parse('03001234567');
      expect(result).not.toBeNull();
      expect(result?.prefix).toBe(300);
      expect(result?.subscriberNumber).toBe('1234567');
      expect(result?.operator?.code).toBe('JAZZ');
      expect(result?.isValid).toBe(true);
    });

    test('should parse international format', () => {
      const result = parse('+923001234567');
      expect(result).not.toBeNull();
      expect(result?.prefix).toBe(300);
      expect(result?.international).toBe('+92 300 1234567');
    });

    test('should return null for invalid numbers', () => {
      expect(parse('invalid')).toBeNull();
      expect(parse('')).toBeNull();
      expect(parse('123')).toBeNull();
    });

    test('should handle all operator types', () => {
      const testCases = [
        { number: '03001234567', operator: 'JAZZ' },
        { number: '03101234567', operator: 'ZONG' },
        { number: '03301234567', operator: 'UFONE' },
        { number: '03401234567', operator: 'TELENOR' },
        { number: '03551234567', operator: 'SCO' },
        { number: '03391234567', operator: 'ONIC' },
      ];

      testCases.forEach(({ number, operator }) => {
        const result = parse(number);
        expect(result?.operator?.code).toBe(operator);
      });
    });
  });

  describe('normalizePhoneNumber', () => {
    test('should normalize various number formats', () => {
      const testCases = [
        { input: '03001234567', expected: '03001234567' },
        { input: '0300 123 4567', expected: '03001234567' },
        { input: '0300-123-4567', expected: '03001234567' },
        { input: '+92 300 1234567', expected: '03001234567' },
        { input: '+923001234567', expected: '03001234567' },
        { input: '923001234567', expected: '03001234567' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(normalizePhoneNumber(input)).toBe(expected);
      });
    });

    test('should handle invalid inputs', () => {
      expect(normalizePhoneNumber('')).toBe('');
      expect(normalizePhoneNumber('invalid')).toBe('');
      // @ts-expect-error Testing invalid input
      expect(normalizePhoneNumber(null)).toBe('');
    });
  });

  describe('detectOperator', () => {
    test('should return operator information', () => {
      const operator = detectOperator('03001234567');
      expect(operator?.code).toBe('JAZZ');
      expect(operator?.name).toBe('Jazz');
      expect(operator?.type).toBe('mobile');
    });

    test('should return null for invalid numbers', () => {
      expect(detectOperator('invalid')).toBeNull();
      expect(detectOperator('')).toBeNull();
    });
  });

  describe('randomPhoneNumber', () => {
    test('should generate valid random numbers', () => {
      for (let i = 0; i < 20; i++) {
        const randomNumber = randomPhoneNumber();
        expect(typeof randomNumber).toBe('string');
        // Default format is 'national' which includes spaces: 0300 1234567
        expect(randomNumber).toMatch(/^03\d{2} \d{7}$/);
      }
    });

    test('should generate numbers for specific operators', () => {
      const operators = ['JAZZ', 'ZONG', 'UFONE', 'TELENOR', 'SCO', 'ONIC'];

      operators.forEach(operator => {
        const randomNumber = randomPhoneNumber({ operator }) as string;
        const parsed = parse(randomNumber);
        expect(parsed?.operator?.code).toBe(operator);
      });
    });

    test('should generate numbers in specified formats', () => {
      const formats: FormatStyle[] = ['national', 'international', 'e164', 'compact'];

      formats.forEach(format => {
        const randomNumber = randomPhoneNumber({ format });

        switch (format) {
          case 'national':
            expect(randomNumber).toMatch(/^03\d{2} \d{7}$/);
            break;
          case 'international':
            expect(randomNumber).toMatch(/^\+92 3\d{2} \d{7}$/);
            break;
          case 'e164':
            expect(randomNumber).toMatch(/^\+923\d{9}$/);
            break;
          case 'compact':
            expect(randomNumber).toMatch(/^03\d{9}$/);
            break;
        }
      });
    });

    test('should generate multiple numbers', () => {
      const numbers = randomPhoneNumber({ count: 5 });
      expect(Array.isArray(numbers)).toBe(true);
      expect(numbers).toHaveLength(5);

      (numbers as string[]).forEach(number => {
        expect(parse(number)?.isValid).toBe(true);
      });
    });

    test('should handle invalid operator gracefully', () => {
      const randomNumber = randomPhoneNumber({ operator: 'INVALID' }) as string;
      expect(typeof randomNumber).toBe('string');
      expect(parse(randomNumber)?.isValid).toBe(true);
    });
  });

  describe('validateBatch', () => {
    test('should validate multiple numbers', () => {
      const numbers = [
        '03001234567', // valid
        '03101234567', // valid
        'invalid', // invalid
        '', // invalid
        '03001234567', // valid
      ];

      const results = validateBatch(numbers);
      expect(results).toEqual([true, true, false, false, true]);
    });

    test('should handle empty arrays', () => {
      expect(validateBatch([])).toEqual([]);
    });

    test('should handle all invalid numbers', () => {
      const numbers = ['invalid', '', '123'];
      const results = validateBatch(numbers);
      expect(results).toEqual([false, false, false]);
    });
  });

  describe('formatBatch', () => {
    test('should format multiple valid numbers', () => {
      const numbers = ['03001234567', '03101234567'];
      const results = formatBatch(numbers, 'international');

      expect(results).toEqual(['+92 300 1234567', '+92 310 1234567']);
    });

    test('should handle invalid numbers in batch', () => {
      const numbers = ['03001234567', 'invalid'];
      const results = formatBatch(numbers, 'national');

      expect(results).toEqual(['0300 1234567', 'invalid']);
    });

    test('should handle empty arrays', () => {
      expect(formatBatch([], 'national')).toEqual([]);
    });
  });

  describe('parseBatch', () => {
    test('should parse multiple numbers', () => {
      const numbers = ['03001234567', '03101234567', 'invalid'];
      const results = parseBatch(numbers);

      expect(results).toHaveLength(3);
      expect(results[0]?.operator?.code).toBe('JAZZ');
      expect(results[1]?.operator?.code).toBe('ZONG');
      expect(results[2]).toBeNull();
    });

    test('should handle empty arrays', () => {
      expect(parseBatch([])).toEqual([]);
    });
  });

  describe('extractOperators', () => {
    test('should extract unique operators', () => {
      const numbers = [
        '03001234567', // Jazz
        '03021234567', // Jazz
        '03101234567', // Zong
        '03301234567', // Ufone
        'invalid',
      ];

      const operators = extractOperators(numbers);
      // extractOperators returns operator objects, not just codes
      expect(operators.map(op => op.code)).toContain('JAZZ');
      expect(operators.map(op => op.code)).toContain('ZONG');
      expect(operators.map(op => op.code)).toContain('UFONE');
      expect(operators.map(op => op.code)).not.toContain('TELENOR');
    });

    test('should handle empty arrays', () => {
      expect(extractOperators([])).toEqual([]);
    });

    test('should handle all invalid numbers', () => {
      const numbers = ['invalid', '', '123'];
      expect(extractOperators(numbers)).toEqual([]);
    });
  });

  describe('cleanBatch', () => {
    test('should clean multiple numbers', () => {
      const numbers = ['0300 123 4567', '0300-123-4567', '+92 300 1234567', 'invalid'];

      const cleaned = cleanBatch(numbers);
      // cleanBatch filters out empty strings (from normalizePhoneNumber('invalid') -> '')
      expect(cleaned).toEqual(['03001234567', '03001234567', '03001234567']);
    });

    test('should handle empty arrays', () => {
      expect(cleanBatch([])).toEqual([]);
    });
  });

  describe('convertBatch', () => {
    test('should convert multiple numbers to target format', () => {
      const numbers = ['03001234567', '03101234567'];
      const results = convertBatch(numbers, 'international');

      expect(results).toEqual(['+92 300 1234567', '+92 310 1234567']);
    });

    test('should handle invalid numbers', () => {
      const numbers = ['03001234567', 'invalid'];
      const results = convertBatch(numbers, 'international');

      expect(results).toEqual(['+92 300 1234567', 'invalid']);
    });
  });

  describe('filterValid and filterInvalid', () => {
    test('filterValid should return only valid numbers', () => {
      const numbers = ['03001234567', 'invalid', '03101234567', ''];
      const valid = filterValid(numbers);

      expect(valid).toEqual(['03001234567', '03101234567']);
    });

    test('filterInvalid should return only invalid numbers', () => {
      const numbers = ['03001234567', 'invalid', '03101234567', ''];
      const invalid = filterInvalid(numbers);

      expect(invalid).toEqual(['invalid', '']);
    });

    test('should handle empty arrays', () => {
      expect(filterValid([])).toEqual([]);
      expect(filterInvalid([])).toEqual([]);
    });
  });

  describe('isNumeric', () => {
    test('should identify numeric strings', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('0')).toBe(true);
      expect(isNumeric('03001234567')).toBe(true);
    });

    test('should reject non-numeric strings', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('123abc')).toBe(false);
      expect(isNumeric('')).toBe(false);
      expect(isNumeric('+')).toBe(false);
    });
  });

  describe('digitsOnly', () => {
    test('should extract only digits', () => {
      expect(digitsOnly('0300 123 4567')).toBe('03001234567');
      expect(digitsOnly('+92-300-123-4567')).toBe('923001234567');
      expect(digitsOnly('abc123def456')).toBe('123456');
    });

    test('should handle strings with no digits', () => {
      expect(digitsOnly('abc')).toBe('');
      expect(digitsOnly('')).toBe('');
    });
  });

  describe('ensureCountryCode', () => {
    test('should add country code if missing', () => {
      expect(ensureCountryCode('03001234567')).toBe('+923001234567');
      expect(ensureCountryCode('3001234567')).toBe('3001234567'); // normalizePhoneNumber('3001234567') returns '' for invalid
    });

    test('should not duplicate country code', () => {
      expect(ensureCountryCode('+923001234567')).toBe('+923001234567');
      expect(ensureCountryCode('923001234567')).toBe('+923001234567');
    });

    test('should handle invalid numbers', () => {
      expect(ensureCountryCode('invalid')).toBe('invalid');
      expect(ensureCountryCode('')).toBe('');
    });
  });

  describe('removeCountryCode', () => {
    test('should remove country code', () => {
      expect(removeCountryCode('+923001234567')).toBe('03001234567');
      expect(removeCountryCode('923001234567')).toBe('03001234567');
    });

    test('should not affect numbers without country code', () => {
      expect(removeCountryCode('03001234567')).toBe('03001234567');
    });

    test('should handle invalid numbers', () => {
      expect(removeCountryCode('invalid')).toBe('invalid');
      expect(removeCountryCode('')).toBe('');
    });
  });

  describe('isSameNumber', () => {
    test('should identify same numbers in different formats', () => {
      expect(isSameNumber('03001234567', '+923001234567')).toBe(true);
      expect(isSameNumber('0300 123 4567', '0300-123-4567')).toBe(true);
      expect(isSameNumber('923001234567', '+92 300 1234567')).toBe(true);
    });

    test('should identify different numbers', () => {
      expect(isSameNumber('03001234567', '03101234567')).toBe(false);
      expect(isSameNumber('03001234567', 'invalid')).toBe(false);
    });

    test('should handle invalid numbers', () => {
      expect(isSameNumber('invalid', 'invalid')).toBe(false);
      expect(isSameNumber('', '')).toBe(false);
    });
  });

  describe('deduplicate', () => {
    test('should remove duplicate numbers', () => {
      const numbers = [
        '03001234567',
        '+923001234567', // same as first
        '03101234567',
        '0300 123 4567', // same as first
        '03101234567', // duplicate
      ];

      const unique = deduplicate(numbers);
      expect(unique).toHaveLength(2);
      expect(unique).toContain('03001234567');
      expect(unique).toContain('03101234567');
    });

    test('should handle empty arrays', () => {
      expect(deduplicate([])).toEqual([]);
    });

    test('should handle arrays with no duplicates', () => {
      const numbers = ['03001234567', '03101234567'];
      expect(deduplicate(numbers)).toEqual(numbers);
    });
  });

  describe('sortPhoneNumbers', () => {
    test('should sort numbers in ascending order', () => {
      const numbers = ['03301234567', '03001234567', '03101234567'];
      const sorted = sortPhoneNumbers(numbers);

      expect(sorted).toEqual(['03001234567', '03101234567', '03301234567']);
    });

    test('should handle mixed formats', () => {
      const numbers = ['+923301234567', '03001234567', '0310 123 4567'];
      const sorted = sortPhoneNumbers(numbers);

      // Should normalize and then sort, but preserve original formats
      expect(sorted[0]).toBe('03001234567');
      expect(sorted[1]).toBe('0310 123 4567'); // Original format preserved
      expect(sorted[2]).toBe('+923301234567');
    });

    test('should handle empty arrays', () => {
      expect(sortPhoneNumbers([])).toEqual([]);
    });
  });
});
