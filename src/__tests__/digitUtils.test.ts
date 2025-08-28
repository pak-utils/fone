import {
  urduToEnglishDigits,
  englishToUrduDigits,
  normalizeDigits,
  hasUrduDigits,
  hasOnlyValidDigits,
  sanitizePhoneInput,
  isSafePhoneInput,
} from '../utils/digitUtils';

describe('Digit Utilities', () => {
  describe('urduToEnglishDigits', () => {
    test('should convert Urdu digits to English digits', () => {
      expect(urduToEnglishDigits('۰۳۰۰۱۲۳۴۵۶۷')).toBe('03001234567');
      expect(urduToEnglishDigits('۰۳۰۰ ۱۲۳ ۴۵۶۷')).toBe('0300 123 4567');
      expect(urduToEnglishDigits('+۹۲ ۳۰۰ ۱۲۳۴۵۶۷')).toBe('+92 300 1234567');
    });

    test('should handle mixed digits', () => {
      expect(urduToEnglishDigits('۰3۰0123456۷')).toBe('03001234567');
      expect(urduToEnglishDigits('0300۱۲3456۷')).toBe('03001234567');
    });

    test('should handle non-digit characters', () => {
      expect(urduToEnglishDigits('۰۳۰۰-۱۲۳-۴۵۶۷')).toBe('0300-123-4567');
      expect(urduToEnglishDigits('۰۳۰۰.۱۲۳.۴۵۶۷')).toBe('0300.123.4567');
    });

    test('should handle empty and invalid inputs', () => {
      expect(urduToEnglishDigits('')).toBe('');
      expect(urduToEnglishDigits(' ')).toBe(' ');
      // @ts-expect-error Testing invalid input
      expect(urduToEnglishDigits(null)).toBe('');
      // @ts-expect-error Testing invalid input
      expect(urduToEnglishDigits(undefined)).toBe('');
    });

    test('should handle strings with no Urdu digits', () => {
      expect(urduToEnglishDigits('03001234567')).toBe('03001234567');
      expect(urduToEnglishDigits('+92 300 1234567')).toBe('+92 300 1234567');
    });
  });

  describe('englishToUrduDigits', () => {
    test('should convert English digits to Urdu digits', () => {
      expect(englishToUrduDigits('03001234567')).toBe('۰۳۰۰۱۲۳۴۵۶۷');
      expect(englishToUrduDigits('0300 123 4567')).toBe('۰۳۰۰ ۱۲۳ ۴۵۶۷');
      expect(englishToUrduDigits('+92 300 1234567')).toBe('+۹۲ ۳۰۰ ۱۲۳۴۵۶۷');
    });

    test('should handle formatting characters', () => {
      expect(englishToUrduDigits('0300-123-4567')).toBe('۰۳۰۰-۱۲۳-۴۵۶۷');
      expect(englishToUrduDigits('0300.123.4567')).toBe('۰۳۰۰.۱۲۳.۴۵۶۷');
    });

    test('should handle empty and invalid inputs', () => {
      expect(englishToUrduDigits('')).toBe('');
      // @ts-expect-error Testing invalid input
      expect(englishToUrduDigits(null)).toBe('');
      // @ts-expect-error Testing invalid input
      expect(englishToUrduDigits(undefined)).toBe('');
    });
  });

  describe('normalizeDigits', () => {
    test('should normalize Urdu digits to English', () => {
      expect(normalizeDigits('۰۳۰۰۱۲۳۴۵۶۷')).toBe('03001234567');
      expect(normalizeDigits('۰3۰0123456۷')).toBe('03001234567');
    });

    test('should not affect English digits', () => {
      expect(normalizeDigits('03001234567')).toBe('03001234567');
    });

    test('should handle empty input', () => {
      expect(normalizeDigits('')).toBe('');
      // @ts-expect-error Testing invalid input
      expect(normalizeDigits(null)).toBe('');
    });
  });

  describe('hasUrduDigits', () => {
    test('should detect Urdu digits', () => {
      expect(hasUrduDigits('۰۳۰۰۱۲۳۴۵۶۷')).toBe(true);
      expect(hasUrduDigits('0300۱۲۳۴۵۶۷')).toBe(true);
      expect(hasUrduDigits('hello ۱۲۳')).toBe(true);
    });

    test('should return false for no Urdu digits', () => {
      expect(hasUrduDigits('03001234567')).toBe(false);
      expect(hasUrduDigits('hello world')).toBe(false);
      expect(hasUrduDigits('')).toBe(false);
    });

    test('should handle invalid inputs', () => {
      // @ts-expect-error Testing invalid input
      expect(hasUrduDigits(null)).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(hasUrduDigits(undefined)).toBe(false);
    });
  });

  describe('hasOnlyValidDigits', () => {
    test('should validate English digits only', () => {
      expect(hasOnlyValidDigits('1234567890')).toBe(true);
    });

    test('should validate Urdu digits only', () => {
      expect(hasOnlyValidDigits('۰۱۲۳۴۵۶۷۸۹')).toBe(true);
    });

    test('should validate mixed valid digits', () => {
      expect(hasOnlyValidDigits('123۴۵۶789')).toBe(true);
    });

    test('should reject non-digit characters', () => {
      expect(hasOnlyValidDigits('123abc')).toBe(false);
      expect(hasOnlyValidDigits('123-456')).toBe(false);
      expect(hasOnlyValidDigits('123 456')).toBe(false);
    });

    test('should handle empty and invalid inputs', () => {
      expect(hasOnlyValidDigits('')).toBe(true); // Empty string has only valid digits (none)
      // @ts-expect-error Testing invalid input
      expect(hasOnlyValidDigits(null)).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(hasOnlyValidDigits(undefined)).toBe(false);
    });
  });

  describe('sanitizePhoneInput', () => {
    test('should sanitize normal phone numbers', () => {
      expect(sanitizePhoneInput('۰۳۰۰۱۲۳۴۵۶۷')).toBe('03001234567');
      expect(sanitizePhoneInput('  0300 123 4567  ')).toBe('0300 123 4567');
    });

    test('should handle multiple spaces', () => {
      expect(sanitizePhoneInput('0300    123   4567')).toBe('0300 123 4567');
    });

    test('should limit excessive length (DoS protection)', () => {
      const longString = '0'.repeat(100);
      const result = sanitizePhoneInput(longString);
      expect(result.length).toBeLessThanOrEqual(50);
    });

    test('should handle invalid inputs', () => {
      expect(sanitizePhoneInput('')).toBe('');
      // @ts-expect-error Testing invalid input
      expect(sanitizePhoneInput(null)).toBe('');
      // @ts-expect-error Testing invalid input
      expect(sanitizePhoneInput(undefined)).toBe('');
    });
  });

  describe('isSafePhoneInput', () => {
    test('should accept safe phone inputs', () => {
      expect(isSafePhoneInput('03001234567')).toBe(true);
      expect(isSafePhoneInput('۰۳۰۰۱۲۳۴۵۶۷')).toBe(true);
      expect(isSafePhoneInput('+92 300 1234567')).toBe(true);
      expect(isSafePhoneInput('0300-123-4567')).toBe(true);
    });

    test('should reject potentially dangerous inputs', () => {
      expect(isSafePhoneInput('<script>alert("xss")</script>')).toBe(false);
      expect(isSafePhoneInput('javascript:alert("xss")')).toBe(false);
      expect(isSafePhoneInput('onclick="alert(1)"')).toBe(false);
      expect(isSafePhoneInput('eval(malicious_code)')).toBe(false);
      expect(isSafePhoneInput('expression(malicious)')).toBe(false);
    });

    test('should handle case insensitive threats', () => {
      expect(isSafePhoneInput('<SCRIPT>alert("xss")</SCRIPT>')).toBe(false);
      expect(isSafePhoneInput('JAVASCRIPT:alert("xss")')).toBe(false);
    });

    test('should handle empty and invalid inputs', () => {
      expect(isSafePhoneInput('')).toBe(true);
      // @ts-expect-error Testing invalid input
      expect(isSafePhoneInput(null)).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(isSafePhoneInput(undefined)).toBe(false);
    });
  });

  describe('Edge cases and performance', () => {
    test('should handle very long strings efficiently', () => {
      const longValidString = '۰'.repeat(1000);
      const start = performance.now();
      urduToEnglishDigits(longValidString);
      const end = performance.now();
      expect(end - start).toBeLessThan(300); // Should complete within 300ms (CI-friendly)
    });

    test('should handle unicode characters correctly', () => {
      expect(urduToEnglishDigits('۰۳۰۰ 🇵🇰 ۱۲۳۴۵۶۷')).toBe('0300 🇵🇰 1234567');
    });

    test('should handle RTL text markers', () => {
      expect(urduToEnglishDigits('\u202E۰۳۰۰۱۲۳۴۵۶۷\u202D')).toBe('\u202E03001234567\u202D');
    });

    test('should handle zero-width characters', () => {
      expect(urduToEnglishDigits('۰\u200B۳\u200C۰\u200D۰۱۲۳۴۵۶۷')).toBe(
        '0\u200B3\u200C0\u200D01234567'
      );
    });
  });
});
