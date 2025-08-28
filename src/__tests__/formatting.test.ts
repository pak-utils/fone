import { format, formatInternational, formatLocal, formatE164 } from '../core/formatters';
import { FormatStyle } from '../types';

describe('Phone Number Formatting', () => {
  const testPhoneNumber = '03001234567';
  const testPhoneNumberWithCountryCode = '+923001234567';
  const testUrduPhoneNumber = '۰۳۰۰۱۲۳۴۵۶۷';
  const testMixedPhoneNumber = '۰3۰0123456۷';

  describe('format function', () => {
    test('should format to national style by default', () => {
      expect(format(testPhoneNumber)).toBe('0300 1234567');
    });

    test('should format to national style', () => {
      expect(format(testPhoneNumber, 'national')).toBe('0300 1234567');
      expect(format(testPhoneNumberWithCountryCode, 'national')).toBe('0300 1234567');
    });

    test('should format to international style', () => {
      expect(format(testPhoneNumber, 'international')).toBe('+92 300 1234567');
      expect(format(testPhoneNumberWithCountryCode, 'international')).toBe('+92 300 1234567');
    });

    test('should format to E164 style', () => {
      expect(format(testPhoneNumber, 'e164')).toBe('+923001234567');
      expect(format(testPhoneNumberWithCountryCode, 'e164')).toBe('+923001234567');
    });

    test('should format to compact style', () => {
      expect(format(testPhoneNumber, 'compact')).toBe('03001234567');
      expect(format(testPhoneNumberWithCountryCode, 'compact')).toBe('03001234567');
    });

    test('should format to dots style', () => {
      expect(format(testPhoneNumber, 'dots')).toBe('0300.123.4567');
      expect(format(testPhoneNumberWithCountryCode, 'dots')).toBe('0300.123.4567');
    });

    test('should format to dashes style', () => {
      expect(format(testPhoneNumber, 'dashes')).toBe('0300-123-4567');
      expect(format(testPhoneNumberWithCountryCode, 'dashes')).toBe('0300-123-4567');
    });

    test('should format Urdu digit phone numbers', () => {
      expect(format(testUrduPhoneNumber, 'national')).toBe('0300 1234567');
      expect(format(testUrduPhoneNumber, 'international')).toBe('+92 300 1234567');
      expect(format(testUrduPhoneNumber, 'e164')).toBe('+923001234567');
      expect(format(testUrduPhoneNumber, 'compact')).toBe('03001234567');
      expect(format(testUrduPhoneNumber, 'dots')).toBe('0300.123.4567');
      expect(format(testUrduPhoneNumber, 'dashes')).toBe('0300-123-4567');
    });

    test('should format mixed digit phone numbers', () => {
      expect(format(testMixedPhoneNumber, 'national')).toBe('0300 1234567');
      expect(format(testMixedPhoneNumber, 'international')).toBe('+92 300 1234567');
      expect(format(testMixedPhoneNumber, 'e164')).toBe('+923001234567');
    });

    test('should handle all operator prefixes correctly', () => {
      const testCases = [
        { number: '03001234567', operator: 'Jazz' },
        { number: '03101234567', operator: 'Zong' },
        { number: '03301234567', operator: 'Ufone' },
        { number: '03401234567', operator: 'Telenor' },
        { number: '03551234567', operator: 'SCO' },
      ];

      testCases.forEach(testCase => {
        expect(format(testCase.number, 'national')).toMatch(/^0\d{3} \d{7}$/);
        expect(format(testCase.number, 'international')).toMatch(/^\+92 \d{3} \d{7}$/);
        expect(format(testCase.number, 'e164')).toMatch(/^\+92\d{10}$/);
      });
    });

    test('should handle formatted input numbers', () => {
      const formattedInputs = [
        '0300 123 4567',
        '0300-123-4567',
        '0300.123.4567',
        '+92 300 1234567',
        '+92-300-1234567',
      ];

      formattedInputs.forEach(input => {
        expect(format(input, 'national')).toBe('0300 1234567');
        expect(format(input, 'e164')).toBe('+923001234567');
      });
    });

    test('should throw error for invalid numbers', () => {
      const invalidNumbers = [
        '',
        'invalid',
        '123',
        '02001234567', // invalid prefix
        '030012345678', // too long
      ];

      invalidNumbers.forEach(number => {
        expect(() => format(number)).toThrow();
      });
    });

    test('should preserve formatting quality across conversions', () => {
      const originalNumber = '03001234567';

      const nationalFormat = format(originalNumber, 'national');
      const internationalFormat = format(nationalFormat, 'international');
      const e164Format = format(internationalFormat, 'e164');
      const backToNational = format(e164Format, 'national');

      expect(backToNational).toBe('0300 1234567');
    });
  });

  describe('formatInternational function', () => {
    test('should format numbers to international format', () => {
      expect(formatInternational('03001234567')).toBe('+92 300 1234567');
      expect(formatInternational('+923001234567')).toBe('+92 300 1234567');
      expect(formatInternational('923001234567')).toBe('+92 300 1234567');
    });

    test('should handle different input formats', () => {
      const inputs = [
        '03001234567',
        '0300 123 4567',
        '+92 300 1234567',
        '+923001234567',
        '923001234567',
      ];

      inputs.forEach(input => {
        expect(formatInternational(input)).toBe('+92 300 1234567');
      });
    });

    test('should throw error for invalid numbers', () => {
      expect(() => formatInternational('')).toThrow();
      expect(() => formatInternational('invalid')).toThrow();
      expect(() => formatInternational('02001234567')).toThrow();
    });
  });

  describe('formatLocal function', () => {
    test('should format numbers to local format', () => {
      expect(formatLocal('03001234567')).toBe('0300 1234567');
      expect(formatLocal('+923001234567')).toBe('0300 1234567');
      expect(formatLocal('923001234567')).toBe('0300 1234567');
    });

    test('should handle different input formats', () => {
      const inputs = [
        '03001234567',
        '0300 123 4567',
        '+92 300 1234567',
        '+923001234567',
        '923001234567',
      ];

      inputs.forEach(input => {
        expect(formatLocal(input)).toBe('0300 1234567');
      });
    });

    test('should throw error for invalid numbers', () => {
      expect(() => formatLocal('')).toThrow();
      expect(() => formatLocal('invalid')).toThrow();
      expect(() => formatLocal('02001234567')).toThrow();
    });
  });

  describe('formatE164 function', () => {
    test('should format numbers to E164 format', () => {
      expect(formatE164('03001234567')).toBe('+923001234567');
      expect(formatE164('+923001234567')).toBe('+923001234567');
      expect(formatE164('923001234567')).toBe('+923001234567');
    });

    test('should handle different input formats', () => {
      const inputs = [
        '03001234567',
        '0300 123 4567',
        '+92 300 1234567',
        '+923001234567',
        '923001234567',
      ];

      inputs.forEach(input => {
        expect(formatE164(input)).toBe('+923001234567');
      });
    });

    test('should throw error for invalid numbers', () => {
      expect(() => formatE164('')).toThrow();
      expect(() => formatE164('invalid')).toThrow();
      expect(() => formatE164('02001234567')).toThrow();
    });
  });

  describe('Performance tests', () => {
    test('should format numbers efficiently', () => {
      const startTime = performance.now();
      const testNumbers = ['03001234567', '+923001234567'];
      const formatStyles: FormatStyle[] = ['national', 'international', 'e164'];

      for (let i = 0; i < 500; i++) {
        testNumbers.forEach(number => {
          formatStyles.forEach(style => format(number, style));
        });
      }

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(500);
    });
  });

  describe('Edge cases', () => {
    test('should handle whitespace in input', () => {
      expect(format('  03001234567  ', 'national')).toBe('0300 1234567');
      expect(format('\t+923001234567\n', 'e164')).toBe('+923001234567');
    });

    test('should handle various separator characters', () => {
      const separatedNumbers = ['0300-123-4567', '0300.123.4567', '0300_123_4567', '0300 123 4567'];

      separatedNumbers.forEach(number => {
        expect(format(number, 'compact')).toBe('03001234567');
      });
    });

    test('should handle parentheses in input', () => {
      expect(format('0300(123)4567', 'national')).toBe('0300 1234567');
      expect(format('+92(300)1234567', 'e164')).toBe('+923001234567');
    });

    test('should be consistent across all format styles', () => {
      const testNumber = '03001234567';
      const formatStyles: FormatStyle[] = [
        'national',
        'international',
        'e164',
        'compact',
        'dots',
        'dashes',
      ];

      formatStyles.forEach(style1 => {
        const formatted1 = format(testNumber, style1);

        formatStyles.forEach(style2 => {
          const formatted2 = format(formatted1, style2);
          const directFormat = format(testNumber, style2);

          expect(formatted2).toBe(directFormat);
        });
      });
    });

    test('should handle numbers with country code variations', () => {
      const variations = [
        '923001234567', // without +
        '+923001234567', // with +
        '0092 300 1234567', // with 00
      ];

      variations.forEach(variation => {
        expect(format(variation, 'e164')).toBe('+923001234567');
        expect(format(variation, 'national')).toBe('0300 1234567');
      });
    });
  });

  describe('Format validation', () => {
    test('should produce valid formats for all styles', () => {
      const testNumbers = [
        '03001234567', // Jazz
        '03101234567', // Zong
        '03301234567', // Ufone
        '03401234567', // Telenor
        '03551234567', // SCO
      ];

      testNumbers.forEach(number => {
        expect(format(number, 'national')).toMatch(/^0\d{3} \d{7}$/);
        expect(format(number, 'international')).toMatch(/^\+92 \d{3} \d{7}$/);
        expect(format(number, 'e164')).toMatch(/^\+92\d{10}$/);
        expect(format(number, 'compact')).toMatch(/^0\d{10}$/);
        expect(format(number, 'dots')).toMatch(/^0\d{3}\.\d{3}\.\d{4}$/);
        expect(format(number, 'dashes')).toMatch(/^0\d{3}-\d{3}-\d{4}$/);
      });
    });
  });
});
