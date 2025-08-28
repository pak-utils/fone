import {
  format,
  formatInternational,
  formatLocal,
  formatE164,
  formatCompact,
  convertFormat,
  matchesFormat,
  detectFormat,
  stripFormatting,
  ensureFormat,
} from '../core/formatters';
import { FormatStyle } from '../types';

describe('Core Formatters', () => {
  const validNumbers = [
    '03001234567', // Jazz
    '03101234567', // Zong
    '03301234567', // Ufone
    '03401234567', // Telenor
    '03551234567', // SCO
    '03391234567', // Onic
  ];

  describe('format function edge cases', () => {
    test('should handle invalid format style gracefully', () => {
      // @ts-expect-error Testing invalid format style
      expect(format('03001234567', 'invalid')).toBe('0300 1234567'); // Should default to national
    });

    test('should format Urdu digit numbers', () => {
      const urduNumber = '۰۳۰۰۱۲۳۴۵۶۷';
      expect(format(urduNumber, 'national')).toBe('0300 1234567');
      expect(format(urduNumber, 'international')).toBe('+92 300 1234567');
      expect(format(urduNumber, 'e164')).toBe('+923001234567');
    });

    test('should handle numbers with country code variations', () => {
      const variations = ['0092 300 1234567', '00923001234567', '92 300 1234567', '923001234567'];

      variations.forEach(variation => {
        expect(format(variation, 'e164')).toBe('+923001234567');
        expect(format(variation, 'national')).toBe('0300 1234567');
      });
    });

    test('should preserve formatting across all operators', () => {
      validNumbers.forEach(number => {
        expect(format(number, 'national')).toMatch(/^03\d{2} \d{7}$/);
        expect(format(number, 'international')).toMatch(/^\+92 3\d{2} \d{7}$/);
        expect(format(number, 'e164')).toMatch(/^\+923\d{9}$/);
        expect(format(number, 'compact')).toMatch(/^03\d{9}$/);
        expect(format(number, 'dots')).toMatch(/^03\d{2}\.\d{3}\.\d{4}$/);
        expect(format(number, 'dashes')).toMatch(/^03\d{2}-\d{3}-\d{4}$/);
      });
    });
  });

  describe('formatCompact', () => {
    test('should format numbers in compact style', () => {
      expect(formatCompact('03001234567')).toBe('03001234567');
      expect(formatCompact('+923001234567')).toBe('03001234567');
      expect(formatCompact('0300 123 4567')).toBe('03001234567');
    });

    test('should throw for invalid numbers', () => {
      expect(() => formatCompact('invalid')).toThrow();
      expect(() => formatCompact('')).toThrow();
    });
  });

  describe('convertFormat', () => {
    test('should convert between all format styles', () => {
      const number = '03001234567';
      const formats: FormatStyle[] = [
        'national',
        'international',
        'e164',
        'compact',
        'dots',
        'dashes',
      ];

      formats.forEach(fromFormat => {
        formats.forEach(toFormat => {
          const formatted = format(number, fromFormat);
          const converted = convertFormat(formatted, fromFormat, toFormat);
          const expected = format(number, toFormat);
          expect(converted).toBe(expected);
        });
      });
    });

    test('should handle conversion from international formats', () => {
      expect(convertFormat('+923001234567', 'e164', 'national')).toBe('0300 1234567');
      expect(convertFormat('+92 300 1234567', 'international', 'compact')).toBe('03001234567');
      expect(convertFormat('+923001234567', 'e164', 'dots')).toBe('0300.123.4567');
    });

    test('should throw for invalid numbers in conversion', () => {
      expect(() => convertFormat('invalid', 'national', 'international')).toThrow();
      expect(() => convertFormat('', 'national', 'e164')).toThrow();
    });

    test('should handle edge case formats', () => {
      expect(convertFormat('923001234567', 'compact', 'national')).toBe('0300 1234567');
      expect(convertFormat('0092 300 1234567', 'international', 'e164')).toBe('+923001234567');
    });
  });

  describe('matchesFormat', () => {
    test('should correctly identify national format', () => {
      expect(matchesFormat('0300 1234567', 'national')).toBe(true);
      expect(matchesFormat('03001234567', 'national')).toBe(false); // no space
      expect(matchesFormat('+92 300 1234567', 'national')).toBe(false);
    });

    test('should correctly identify international format', () => {
      expect(matchesFormat('+92 300 1234567', 'international')).toBe(true);
      expect(matchesFormat('+923001234567', 'international')).toBe(false); // no spaces
      expect(matchesFormat('0300 1234567', 'international')).toBe(false);
    });

    test('should correctly identify e164 format', () => {
      expect(matchesFormat('+923001234567', 'e164')).toBe(true);
      expect(matchesFormat('+92 300 1234567', 'e164')).toBe(false); // has spaces
      expect(matchesFormat('03001234567', 'e164')).toBe(false);
    });

    test('should correctly identify compact format', () => {
      expect(matchesFormat('03001234567', 'compact')).toBe(true);
      expect(matchesFormat('0300 1234567', 'compact')).toBe(false); // has space
      expect(matchesFormat('+923001234567', 'compact')).toBe(false);
    });

    test('should correctly identify dots format', () => {
      expect(matchesFormat('0300.123.4567', 'dots')).toBe(true);
      expect(matchesFormat('0300-123-4567', 'dots')).toBe(false);
      expect(matchesFormat('0300 123 4567', 'dots')).toBe(false);
    });

    test('should correctly identify dashes format', () => {
      expect(matchesFormat('0300-123-4567', 'dashes')).toBe(true);
      expect(matchesFormat('0300.123.4567', 'dashes')).toBe(false);
      expect(matchesFormat('0300 123 4567', 'dashes')).toBe(false);
    });

    test('should handle invalid inputs', () => {
      expect(matchesFormat('', 'national')).toBe(false);
      expect(matchesFormat('invalid', 'national')).toBe(false);
      // @ts-expect-error Testing null input
      expect(matchesFormat(null, 'national')).toBe(false);
    });

    test('should handle invalid format styles', () => {
      // @ts-expect-error Testing invalid format style
      expect(matchesFormat('03001234567', 'invalid')).toBe(false);
    });
  });

  describe('detectFormat', () => {
    test('should detect all format styles correctly', () => {
      expect(detectFormat('0300 1234567')).toBe('national');
      expect(detectFormat('+92 300 1234567')).toBe('international');
      expect(detectFormat('+923001234567')).toBe('e164');
      expect(detectFormat('03001234567')).toBe('compact');
      expect(detectFormat('0300.123.4567')).toBe('dots');
      expect(detectFormat('0300-123-4567')).toBe('dashes');
    });

    test('should return null for unknown formats', () => {
      expect(detectFormat('invalid')).toBeNull();
      expect(detectFormat('')).toBeNull();
      expect(detectFormat('123')).toBeNull();
    });

    test('should handle invalid inputs', () => {
      // @ts-expect-error Testing null input
      expect(detectFormat(null)).toBeNull();
      // @ts-expect-error Testing undefined input
      expect(detectFormat(undefined)).toBeNull();
    });

    test('should handle edge cases', () => {
      expect(detectFormat('  0300 1234567  ')).toBeNull(); // extra spaces
      expect(detectFormat('0300  123  4567')).toBeNull(); // extra spaces
    });
  });

  describe('stripFormatting', () => {
    test('should strip all formatting characters', () => {
      expect(stripFormatting('0300 123 4567')).toBe('03001234567');
      expect(stripFormatting('0300-123-4567')).toBe('03001234567');
      expect(stripFormatting('0300.123.4567')).toBe('03001234567');
      expect(stripFormatting('0300_123_4567')).toBe('03001234567');
      expect(stripFormatting('(0300) 123-4567')).toBe('03001234567');
    });

    test('should handle international formats', () => {
      expect(stripFormatting('+92 300 123 4567')).toBe('03001234567');
      expect(stripFormatting('+92-300-123-4567')).toBe('03001234567');
      expect(stripFormatting('+923001234567')).toBe('03001234567');
    });

    test('should handle country code without plus', () => {
      expect(stripFormatting('92 300 1234567')).toBe('03001234567');
      expect(stripFormatting('923001234567')).toBe('03001234567');
    });

    test('should handle invalid inputs', () => {
      expect(stripFormatting('')).toBe('');
      expect(stripFormatting('abc')).toBe('');
      // @ts-expect-error Testing null input
      expect(stripFormatting(null)).toBe('');
    });

    test('should handle edge cases', () => {
      expect(stripFormatting('   +92 300 123 4567   ')).toBe('03001234567');
      expect(stripFormatting('\\t+92\\n300\\r123\\s4567')).toBe('03001234567');
    });
  });

  describe('ensureFormat', () => {
    test('should format valid numbers', () => {
      expect(ensureFormat('03001234567')).toBe('0300 1234567'); // default national
      expect(ensureFormat('03001234567', 'international')).toBe('+92 300 1234567');
      expect(ensureFormat('03001234567', 'e164')).toBe('+923001234567');
    });

    test('should return original for invalid numbers', () => {
      expect(ensureFormat('invalid')).toBe('invalid');
      expect(ensureFormat('')).toBe('');
      expect(ensureFormat('123')).toBe('123');
    });

    test('should handle different target styles', () => {
      const formats: FormatStyle[] = [
        'national',
        'international',
        'e164',
        'compact',
        'dots',
        'dashes',
      ];

      formats.forEach(format => {
        const result = ensureFormat('03001234567', format);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    test('should not throw on invalid inputs', () => {
      expect(() => ensureFormat('invalid')).not.toThrow();
      expect(() => ensureFormat('')).not.toThrow();
      // @ts-expect-error Testing null input
      expect(() => ensureFormat(null)).not.toThrow();
    });
  });

  describe('Integration tests', () => {
    test('should maintain consistency across formatters', () => {
      const number = '03001234567';

      expect(formatLocal(number)).toBe(format(number, 'national'));
      expect(formatInternational(number)).toBe(format(number, 'international'));
      expect(formatE164(number)).toBe(format(number, 'e164'));
      expect(formatCompact(number)).toBe(format(number, 'compact'));
    });

    test('should handle round-trip conversions', () => {
      const originalNumber = '03001234567';
      const formats: FormatStyle[] = ['national', 'international', 'e164', 'compact'];

      formats.forEach(format1 => {
        const formatted1 = format(originalNumber, format1);

        formats.forEach(format2 => {
          const converted = convertFormat(formatted1, format1, format2);
          const directFormat = format(originalNumber, format2);
          expect(converted).toBe(directFormat);
        });
      });
    });

    test('should work with all supported operators', () => {
      validNumbers.forEach(number => {
        const formats: FormatStyle[] = [
          'national',
          'international',
          'e164',
          'compact',
          'dots',
          'dashes',
        ];

        formats.forEach(formatStyle => {
          expect(() => format(number, formatStyle)).not.toThrow();
          expect(format(number, formatStyle)).toBeTruthy();
          expect(typeof format(number, formatStyle)).toBe('string');
        });
      });
    });

    test('should detect and convert formats correctly', () => {
      const testCases = [
        { input: '0300 1234567', detected: 'national' },
        { input: '+92 300 1234567', detected: 'international' },
        { input: '+923001234567', detected: 'e164' },
        { input: '03001234567', detected: 'compact' },
        { input: '0300.123.4567', detected: 'dots' },
        { input: '0300-123-4567', detected: 'dashes' },
      ];

      testCases.forEach(({ input, detected }) => {
        expect(detectFormat(input)).toBe(detected);

        // Test conversion to different formats
        const formats: FormatStyle[] = ['national', 'international', 'e164', 'compact'];
        formats.forEach(targetFormat => {
          const result = convertFormat(input, detected as FormatStyle, targetFormat);
          expect(typeof result).toBe('string');
          expect(result.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Performance and edge cases', () => {
    test('should handle bulk formatting efficiently', () => {
      const numbers = Array(100).fill('03001234567');
      const startTime = performance.now();

      numbers.forEach(number => {
        format(number, 'national');
        format(number, 'international');
        format(number, 'e164');
      });

      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(300); // Should be fast (CI-friendly threshold)
    });

    test('should handle unusual whitespace', () => {
      const unusualSpaces = '0300\\t123\\n4567';
      expect(stripFormatting(unusualSpaces)).toBe('03001234567');
    });

    test('should handle unicode characters', () => {
      const withUnicode = '0300\u200B123\u200C4567'; // zero-width characters
      expect(stripFormatting(withUnicode)).toBe('03001234567');
    });

    test('should validate format patterns strictly', () => {
      // These should not match due to strict patterns
      expect(matchesFormat('0300  1234567', 'national')).toBe(false); // double space
      expect(matchesFormat('03001234567 ', 'compact')).toBe(false); // trailing space
      expect(matchesFormat(' 03001234567', 'compact')).toBe(false); // leading space
      expect(matchesFormat('+92  300 1234567', 'international')).toBe(false); // double space
    });
  });
});
