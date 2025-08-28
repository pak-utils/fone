import { parse, randomPhoneNumber } from '../utils/helpers';
import { detectOperator } from '../core/operators';
import { normalizePhoneNumber } from '../utils/digitUtils';
import { GeneratorOptions } from '../types';

describe('Phone Number Parsing and Utilities', () => {
  describe('parse function', () => {
    test('should parse valid Pakistani mobile numbers', () => {
      const result = parse('03001234567');

      expect(result).not.toBeNull();
      expect(result?.isValid).toBe(true);
      expect(result?.raw).toBe('03001234567');
      expect(result?.formatted).toBe('0300 1234567');
      expect(result?.international).toBe('+92 300 1234567');
      expect(result?.local).toBe('0300 1234567');
      expect(result?.type).toBe('mobile');
      expect(result?.prefix).toBe(300);
      expect(result?.subscriberNumber).toBe('1234567');
      expect(result?.operator?.code).toBe('JAZZ');
    });

    test('should parse international format', () => {
      const result = parse('+923001234567');

      expect(result).not.toBeNull();
      expect(result?.isValid).toBe(true);
      expect(result?.raw).toBe('+923001234567');
      expect(result?.international).toBe('+92 300 1234567');
      expect(result?.local).toBe('0300 1234567');
    });

    test('should parse formatted numbers', () => {
      const formattedNumbers = [
        '0300 123 4567',
        '0300-123-4567',
        '0300.123.4567',
        '+92 300 1234567',
        '+92-300-1234567',
      ];

      formattedNumbers.forEach(number => {
        const result = parse(number);
        expect(result).not.toBeNull();
        expect(result?.prefix).toBe(300);
        expect(result?.subscriberNumber).toBe('1234567');
      });
    });

    test('should return null for invalid numbers', () => {
      const invalidNumbers = [
        '',
        'invalid',
        '123',
        '02001234567', // invalid prefix
        '030012345678', // too long
        '0300123456', // too short
      ];

      invalidNumbers.forEach(number => {
        expect(parse(number)).toBeNull();
      });
    });

    test('should parse all operator numbers correctly', () => {
      const operatorTests = [
        { number: '03001234567', expectedOperator: 'JAZZ' },
        { number: '03101234567', expectedOperator: 'ZONG' },
        { number: '03301234567', expectedOperator: 'UFONE' },
        { number: '03401234567', expectedOperator: 'TELENOR' },
        { number: '03391234567', expectedOperator: 'ONIC' },
        { number: '03551234567', expectedOperator: 'SCO' },
      ];

      operatorTests.forEach(test => {
        const result = parse(test.number);
        expect(result?.operator?.code).toBe(test.expectedOperator);
      });
    });

    test('should parse Urdu digit phone numbers', () => {
      const result = parse('۰۳۰۰۱۲۳۴۵۶۷');

      expect(result).not.toBeNull();
      expect(result?.isValid).toBe(true);
      expect(result?.raw).toBe('۰۳۰۰۱۲۳۴۵۶۷');
      expect(result?.formatted).toBe('0300 1234567');
      expect(result?.international).toBe('+92 300 1234567');
      expect(result?.operator?.code).toBe('JAZZ');
    });

    test('should parse mixed digit phone numbers', () => {
      const result = parse('۰3۰0123456۷');

      expect(result).not.toBeNull();
      expect(result?.prefix).toBe(300);
      expect(result?.subscriberNumber).toBe('1234567');
      expect(result?.operator?.code).toBe('JAZZ');
    });

    test('should extract correct subscriber numbers', () => {
      const tests = [
        { number: '03001234567', expected: '1234567' },
        { number: '03009876543', expected: '9876543' },
        { number: '03001111111', expected: '1111111' },
      ];

      tests.forEach(test => {
        const result = parse(test.number);
        expect(result?.subscriberNumber).toBe(test.expected);
      });
    });
  });

  describe('normalizePhoneNumber function', () => {
    test('should normalize phone numbers to consistent format', () => {
      const testCases = [
        { input: '03001234567', expected: '03001234567' },
        { input: '0300 123 4567', expected: '03001234567' },
        { input: '0300-123-4567', expected: '03001234567' },
        { input: '0300.123.4567', expected: '03001234567' },
        { input: '+92 300 1234567', expected: '03001234567' },
        { input: '+923001234567', expected: '03001234567' },
        { input: '923001234567', expected: '03001234567' },
        { input: '+92(300)1234567', expected: '03001234567' },
      ];

      testCases.forEach(testCase => {
        expect(normalizePhoneNumber(testCase.input)).toBe(testCase.expected);
      });
    });

    test('should handle whitespace and special characters', () => {
      expect(normalizePhoneNumber('  0300 123 4567  ')).toBe('03001234567');
      expect(normalizePhoneNumber('\t+92-300-123-4567\n')).toBe('03001234567');
      expect(normalizePhoneNumber('0300_123_4567')).toBe('03001234567');
    });

    test('should return empty string for invalid input', () => {
      const invalidInputs = ['', 'invalid', 'abc123', '123abc', null, undefined];

      invalidInputs.forEach(input => {
        // @ts-expect-error Testing invalid inputs
        expect(normalizePhoneNumber(input)).toBe('');
      });
    });

    test('should preserve valid normalized numbers', () => {
      const alreadyNormalized = '03001234567';
      expect(normalizePhoneNumber(alreadyNormalized)).toBe(alreadyNormalized);
    });
  });

  describe('detectOperator function', () => {
    test('should return correct operator information', () => {
      const result = detectOperator('03001234567');

      expect(result).not.toBeNull();
      expect(result?.code).toBe('JAZZ');
      expect(result?.name).toBe('Jazz');
      expect(result?.type).toBe('mobile');
    });

    test('should work with different number formats', () => {
      const formats = ['03001234567', '0300 123 4567', '+92 300 1234567', '+923001234567'];

      formats.forEach(format => {
        const result = detectOperator(format);
        expect(result?.code).toBe('JAZZ');
      });
    });

    test('should return null for invalid numbers', () => {
      const invalidNumbers = [
        '',
        'invalid',
        '02001234567', // invalid prefix
        '04001234567',
      ];

      invalidNumbers.forEach(number => {
        expect(detectOperator(number)).toBeNull();
      });
    });

    test('should identify all operators correctly', () => {
      const operatorTests = [
        { number: '03001234567', expected: 'JAZZ' },
        { number: '03211234567', expected: 'JAZZ' },
        { number: '03101234567', expected: 'ZONG' },
        { number: '03191234567', expected: 'ZONG' },
        { number: '03301234567', expected: 'UFONE' },
        { number: '03381234567', expected: 'UFONE' },
        { number: '03391234567', expected: 'ONIC' },
        { number: '03401234567', expected: 'TELENOR' },
        { number: '03491234567', expected: 'TELENOR' },
        { number: '03551234567', expected: 'SCO' },
      ];

      operatorTests.forEach(test => {
        const result = detectOperator(test.number);
        expect(result?.code).toBe(test.expected);
      });
    });
  });

  describe('randomPhoneNumber function', () => {
    test('should generate valid random phone numbers', () => {
      for (let i = 0; i < 100; i++) {
        const randomNumber = randomPhoneNumber() as string;
        expect(parse(randomNumber as string)).not.toBeNull();
        expect(parse(randomNumber)?.isValid).toBe(true);
      }
    });

    test('should generate numbers for specific operators', () => {
      const operators = ['JAZZ', 'ZONG', 'UFONE', 'TELENOR', 'SCO'];

      operators.forEach(operatorCode => {
        for (let i = 0; i < 10; i++) {
          const randomNumber = randomPhoneNumber({ operator: operatorCode }) as string;
          const parsed = parse(randomNumber);

          expect(parsed?.operator?.code).toBe(operatorCode);
        }
      });
    });

    test('should generate numbers in specified format', () => {
      const options: GeneratorOptions = {
        format: 'international',
        count: 1,
      };

      const randomNumber = randomPhoneNumber(options);
      expect(randomNumber).toMatch(/^\+92 \d{3} \d{7}$/);
    });

    test('should generate multiple numbers when count is specified', () => {
      const options: GeneratorOptions = {
        count: 5,
      };

      const randomNumbers = randomPhoneNumber(options);
      expect(Array.isArray(randomNumbers)).toBe(true);
      expect(randomNumbers).toHaveLength(5);

      (randomNumbers as string[]).forEach(number => {
        expect(parse(number)?.isValid).toBe(true);
      });
    });

    test('should respect format option', () => {
      const formats = ['national', 'international', 'e164', 'compact'] as const;

      formats.forEach(format => {
        const randomNumber = randomPhoneNumber({ format });

        switch (format) {
          case 'national':
            expect(randomNumber).toMatch(/^0\d{3} \d{7}$/);
            break;
          case 'international':
            expect(randomNumber).toMatch(/^\+92 \d{3} \d{7}$/);
            break;
          case 'e164':
            expect(randomNumber).toMatch(/^\+92\d{10}$/);
            break;
          case 'compact':
            expect(randomNumber).toMatch(/^0\d{10}$/);
            break;
        }
      });
    });

    test('should handle invalid operator gracefully', () => {
      const randomNumber = randomPhoneNumber({ operator: 'INVALID_OPERATOR' }) as string;
      // Should still generate a valid number from any operator
      expect(parse(randomNumber)?.isValid).toBe(true);
    });
  });

  describe('Integration tests', () => {
    test('should maintain consistency across parse and format operations', () => {
      const originalNumber = '03001234567';
      const parsed = parse(originalNumber);

      expect(parsed).not.toBeNull();
      expect(normalizePhoneNumber(parsed!.formatted)).toBe(originalNumber);
      expect(normalizePhoneNumber(parsed!.international)).toBe(originalNumber);
      expect(normalizePhoneNumber(parsed!.local)).toBe(originalNumber);
    });

    test('should handle round-trip conversions correctly', () => {
      const testNumbers = [
        '03001234567',
        '03101234567',
        '03301234567',
        '03401234567',
        '03551234567',
      ];

      testNumbers.forEach(number => {
        const parsed = parse(number);
        expect(parsed).not.toBeNull();

        const reparsedFromFormatted = parse(parsed!.formatted);
        const reparsedFromInternational = parse(parsed!.international);

        expect(reparsedFromFormatted?.prefix).toBe(parsed!.prefix);
        expect(reparsedFromInternational?.prefix).toBe(parsed!.prefix);
        expect(reparsedFromFormatted?.subscriberNumber).toBe(parsed!.subscriberNumber);
        expect(reparsedFromInternational?.subscriberNumber).toBe(parsed!.subscriberNumber);
      });
    });
  });

  describe('Performance tests', () => {
    test('should parse numbers efficiently', () => {
      const startTime = performance.now();

      const testNumbers = ['03001234567', '+923001234567', '0300 123 4567', 'invalid'];

      // Perform 1000 parsing operations
      for (let i = 0; i < 1000; i++) {
        testNumbers.forEach(number => parse(number));
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within 400ms (CI-friendly threshold for GitHub Actions)
      expect(duration).toBeLessThan(400);
    });

    test('should normalize numbers efficiently', () => {
      const startTime = performance.now();

      // Perform 5000 normalizations
      for (let i = 0; i < 5000; i++) {
        normalizePhoneNumber('0300 123 4567');
        normalizePhoneNumber('+92 300 1234567');
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within 200ms (CI-friendly threshold for GitHub Actions)
      expect(duration).toBeLessThan(200);
    });
  });
});
