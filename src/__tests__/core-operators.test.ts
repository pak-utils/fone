import {
  detectOperator,
  isOperator,
  isJazz,
  isZong,
  isUfone,
  isTelenor,
  isSCO,
  isOnic,
  getOperatorInfo,
  getSupportedOperators,
  isSupportedOperator,
  getOperatorStats,
  filterByOperator,
  groupByOperator,
  isPrefixOfOperator,
  getOperatorPrefixes,
} from '../core/operators';

describe('Core Operators', () => {
  describe('detectOperator', () => {
    test('should detect Jazz operator', () => {
      const result = detectOperator('03001234567');
      expect(result).not.toBeNull();
      expect(result?.code).toBe('JAZZ');
      expect(result?.name).toBe('Jazz');
    });

    test('should detect Zong operator', () => {
      const result = detectOperator('03101234567');
      expect(result).not.toBeNull();
      expect(result?.code).toBe('ZONG');
      expect(result?.name).toBe('Zong');
    });

    test('should detect Ufone operator', () => {
      const result = detectOperator('03301234567');
      expect(result).not.toBeNull();
      expect(result?.code).toBe('UFONE');
      expect(result?.name).toBe('Ufone');
    });

    test('should detect Telenor operator', () => {
      const result = detectOperator('03401234567');
      expect(result).not.toBeNull();
      expect(result?.code).toBe('TELENOR');
      expect(result?.name).toBe('Telenor');
    });

    test('should detect SCO operator', () => {
      const result = detectOperator('03551234567');
      expect(result).not.toBeNull();
      expect(result?.code).toBe('SCO');
      expect(result?.name).toBe('Special Communications Organization');
    });

    test('should detect Onic operator', () => {
      const result = detectOperator('03391234567');
      expect(result).not.toBeNull();
      expect(result?.code).toBe('ONIC');
      expect(result?.name).toBe('Onic');
    });

    test('should return null for invalid numbers', () => {
      expect(detectOperator('invalid')).toBeNull();
      expect(detectOperator('123')).toBeNull();
      expect(detectOperator('')).toBeNull();
    });

    test('should handle different number formats', () => {
      const formats = [
        '03001234567',
        '0300 123 4567',
        '+92 300 1234567',
        '+923001234567',
        '923001234567',
      ];

      formats.forEach(format => {
        const result = detectOperator(format);
        expect(result?.code).toBe('JAZZ');
      });
    });
  });

  describe('isOperator', () => {
    test('should correctly identify operators', () => {
      expect(isOperator('03001234567', 'JAZZ')).toBe(true);
      expect(isOperator('03101234567', 'ZONG')).toBe(true);
      expect(isOperator('03301234567', 'UFONE')).toBe(true);
      expect(isOperator('03401234567', 'TELENOR')).toBe(true);
      expect(isOperator('03551234567', 'SCO')).toBe(true);
      expect(isOperator('03391234567', 'ONIC')).toBe(true);
    });

    test('should be case insensitive', () => {
      expect(isOperator('03001234567', 'jazz')).toBe(true);
      expect(isOperator('03101234567', 'zong')).toBe(true);
      expect(isOperator('03301234567', 'ufone')).toBe(true);
      expect(isOperator('03401234567', 'TELENOR')).toBe(true);
    });

    test('should return false for incorrect operators', () => {
      expect(isOperator('03001234567', 'ZONG')).toBe(false);
      expect(isOperator('03101234567', 'JAZZ')).toBe(false);
      expect(isOperator('invalid', 'JAZZ')).toBe(false);
    });
  });

  describe('Individual operator functions', () => {
    describe('isJazz', () => {
      test('should identify Jazz numbers correctly', () => {
        const jazzNumbers = [
          '03001234567',
          '03011234567',
          '03021234567',
          '03031234567',
          '03041234567',
          '03051234567',
          '03061234567',
          '03071234567',
          '03081234567',
          '03091234567',
          '03201234567',
          '03291234567',
        ];

        jazzNumbers.forEach(number => {
          expect(isJazz(number)).toBe(true);
        });
      });

      test('should return false for non-Jazz numbers', () => {
        expect(isJazz('03101234567')).toBe(false); // Zong
        expect(isJazz('03301234567')).toBe(false); // Ufone
        expect(isJazz('03401234567')).toBe(false); // Telenor
        expect(isJazz('invalid')).toBe(false);
      });
    });

    describe('isZong', () => {
      test('should identify Zong numbers correctly', () => {
        const zongNumbers = [
          '03101234567',
          '03111234567',
          '03121234567',
          '03131234567',
          '03141234567',
          '03151234567',
          '03161234567',
          '03171234567',
          '03181234567',
          '03191234567',
        ];

        zongNumbers.forEach(number => {
          expect(isZong(number)).toBe(true);
        });
      });

      test('should return false for non-Zong numbers', () => {
        expect(isZong('03001234567')).toBe(false); // Jazz
        expect(isZong('03301234567')).toBe(false); // Ufone
        expect(isZong('invalid')).toBe(false);
      });
    });

    describe('isUfone', () => {
      test('should identify Ufone numbers correctly', () => {
        const ufoneNumbers = [
          '03301234567',
          '03311234567',
          '03321234567',
          '03331234567',
          '03341234567',
          '03351234567',
          '03361234567',
          '03371234567',
          '03381234567',
        ];

        ufoneNumbers.forEach(number => {
          expect(isUfone(number)).toBe(true);
        });
      });

      test('should return false for non-Ufone numbers', () => {
        expect(isUfone('03001234567')).toBe(false); // Jazz
        expect(isUfone('03101234567')).toBe(false); // Zong
        expect(isUfone('invalid')).toBe(false);
      });
    });

    describe('isTelenor', () => {
      test('should identify Telenor numbers correctly', () => {
        const telenorNumbers = [
          '03401234567',
          '03411234567',
          '03421234567',
          '03431234567',
          '03441234567',
          '03451234567',
          '03461234567',
          '03471234567',
          '03481234567',
          '03491234567',
        ];

        telenorNumbers.forEach(number => {
          expect(isTelenor(number)).toBe(true);
        });
      });

      test('should return false for non-Telenor numbers', () => {
        expect(isTelenor('03001234567')).toBe(false); // Jazz
        expect(isTelenor('03101234567')).toBe(false); // Zong
        expect(isTelenor('invalid')).toBe(false);
      });
    });

    describe('isSCO', () => {
      test('should identify SCO numbers correctly', () => {
        expect(isSCO('03551234567')).toBe(true);
      });

      test('should return false for non-SCO numbers', () => {
        expect(isSCO('03001234567')).toBe(false); // Jazz
        expect(isSCO('03101234567')).toBe(false); // Zong
        expect(isSCO('invalid')).toBe(false);
      });
    });

    describe('isOnic', () => {
      test('should identify Onic numbers correctly', () => {
        expect(isOnic('03391234567')).toBe(true);
      });

      test('should return false for non-Onic numbers', () => {
        expect(isOnic('03001234567')).toBe(false); // Jazz
        expect(isOnic('03101234567')).toBe(false); // Zong
        expect(isOnic('invalid')).toBe(false);
      });
    });
  });

  describe('getOperatorInfo', () => {
    test('should return operator info for valid phone numbers', () => {
      const jazzInfo = getOperatorInfo('03001234567');
      expect(jazzInfo).not.toBeNull();
      expect(jazzInfo?.name).toBe('Jazz');
      expect(jazzInfo?.prefix).toBe(300);
    });

    test('should return null for invalid phone numbers', () => {
      expect(getOperatorInfo('invalid')).toBeNull();
      expect(getOperatorInfo('')).toBeNull();
      expect(getOperatorInfo('123')).toBeNull();
    });

    test('should work with different formats', () => {
      const formats = ['03001234567', '+923001234567', '923001234567', '0300 123 4567'];

      formats.forEach(format => {
        const info = getOperatorInfo(format);
        expect(info?.code).toBe('JAZZ');
        expect(info?.prefix).toBe(300);
      });
    });
  });

  describe('getSupportedOperators', () => {
    test('should return all supported operators', () => {
      const operators = getSupportedOperators();
      expect(operators).toHaveLength(6);

      const codes = operators.map(op => op.code);
      expect(codes).toContain('JAZZ');
      expect(codes).toContain('ZONG');
      expect(codes).toContain('UFONE');
      expect(codes).toContain('TELENOR');
      expect(codes).toContain('SCO');
      expect(codes).toContain('ONIC');
    });

    test('should return readonly array', () => {
      const operators = getSupportedOperators();
      // TypeScript should prevent mutation, but at runtime it might not throw
      // This test verifies the array has the correct structure
      expect(Array.isArray(operators)).toBe(true);
      expect(operators.every(op => 'code' in op && 'name' in op)).toBe(true);
    });
  });

  describe('isSupportedOperator', () => {
    test('should return true for supported operators', () => {
      expect(isSupportedOperator('JAZZ')).toBe(true);
      expect(isSupportedOperator('ZONG')).toBe(true);
      expect(isSupportedOperator('UFONE')).toBe(true);
      expect(isSupportedOperator('TELENOR')).toBe(true);
      expect(isSupportedOperator('SCO')).toBe(true);
      expect(isSupportedOperator('ONIC')).toBe(true);
    });

    test('should return false for unsupported operators', () => {
      expect(isSupportedOperator('INVALID')).toBe(false);
      expect(isSupportedOperator('')).toBe(false);
    });

    test('should be case insensitive', () => {
      expect(isSupportedOperator('jazz')).toBe(true);
      expect(isSupportedOperator('ZONG')).toBe(true);
    });
  });

  describe('getOperatorStats', () => {
    test('should return stats for phone number arrays', () => {
      const phoneNumbers = [
        '03001234567', // Jazz
        '03021234567', // Jazz
        '03101234567', // Zong
        '03301234567', // Ufone
        'invalid',
      ];

      const stats = getOperatorStats(phoneNumbers);
      expect(stats.JAZZ).toBe(2);
      expect(stats.ZONG).toBe(1);
      expect(stats.UFONE).toBe(1);
    });

    test('should handle empty arrays', () => {
      const stats = getOperatorStats([]);
      expect(stats.JAZZ).toBe(0);
      expect(stats.ZONG).toBe(0);
      expect(stats.UFONE).toBe(0);
      expect(stats.TELENOR).toBe(0);
      expect(stats.SCO).toBe(0);
      expect(stats.ONIC).toBe(0);
      expect(stats.UNKNOWN).toBe(0);
    });

    test('should handle arrays with invalid numbers', () => {
      const phoneNumbers = ['invalid', '123', ''];
      const stats = getOperatorStats(phoneNumbers);
      expect(stats.UNKNOWN).toBe(3);
      expect(stats.JAZZ).toBe(0);
      expect(stats.ZONG).toBe(0);
    });
  });

  describe('filterByOperator', () => {
    test('should filter numbers by operator', () => {
      const numbers = [
        '03001234567', // Jazz
        '03101234567', // Zong
        '03301234567', // Ufone
        '03401234567', // Telenor
        'invalid',
      ];

      const jazzNumbers = filterByOperator(numbers, 'JAZZ');
      expect(jazzNumbers).toHaveLength(1);
      expect(jazzNumbers[0]).toBe('03001234567');

      const zongNumbers = filterByOperator(numbers, 'ZONG');
      expect(zongNumbers).toHaveLength(1);
      expect(zongNumbers[0]).toBe('03101234567');
    });

    test('should handle empty arrays', () => {
      const result = filterByOperator([], 'JAZZ');
      expect(result).toHaveLength(0);
    });

    test('should handle invalid operators', () => {
      const numbers = ['03001234567'];
      const result = filterByOperator(numbers, 'INVALID');
      expect(result).toHaveLength(0);
    });
  });

  describe('groupByOperator', () => {
    test('should group numbers by operator', () => {
      const numbers = [
        '03001234567', // Jazz
        '03021234567', // Jazz
        '03101234567', // Zong
        '03301234567', // Ufone
        'invalid',
      ];

      const grouped = groupByOperator(numbers);
      expect(grouped.JAZZ).toHaveLength(2);
      expect(grouped.ZONG).toHaveLength(1);
      expect(grouped.UFONE).toHaveLength(1);
      expect(grouped.UNKNOWN).toHaveLength(1);
    });

    test('should initialize all operator groups', () => {
      const result = groupByOperator([]);
      expect(result.JAZZ).toHaveLength(0);
      expect(result.ZONG).toHaveLength(0);
      expect(result.UFONE).toHaveLength(0);
      expect(result.TELENOR).toHaveLength(0);
      expect(result.SCO).toHaveLength(0);
      expect(result.ONIC).toHaveLength(0);
      expect(result.UNKNOWN).toHaveLength(0);
    });
  });

  describe('isPrefixOfOperator', () => {
    test('should identify prefixes correctly', () => {
      expect(isPrefixOfOperator(300, 'JAZZ')).toBe(true);
      expect(isPrefixOfOperator(310, 'ZONG')).toBe(true);
      expect(isPrefixOfOperator(330, 'UFONE')).toBe(true);
      expect(isPrefixOfOperator(340, 'TELENOR')).toBe(true);
      expect(isPrefixOfOperator(355, 'SCO')).toBe(true);
      expect(isPrefixOfOperator(339, 'ONIC')).toBe(true);
    });

    test('should return false for incorrect combinations', () => {
      expect(isPrefixOfOperator(300, 'ZONG')).toBe(false);
      expect(isPrefixOfOperator(310, 'JAZZ')).toBe(false);
      expect(isPrefixOfOperator(999, 'JAZZ')).toBe(false);
    });

    test('should be case insensitive', () => {
      expect(isPrefixOfOperator(300, 'jazz')).toBe(true);
      expect(isPrefixOfOperator(310, 'ZONG')).toBe(true);
    });
  });

  describe('getOperatorPrefixes', () => {
    test('should return prefixes for valid operators', () => {
      const jazzPrefixes = getOperatorPrefixes('JAZZ');
      expect(jazzPrefixes).toContain(300);
      expect(jazzPrefixes).toContain(301);
      expect(jazzPrefixes.length).toBeGreaterThan(0);

      const zongPrefixes = getOperatorPrefixes('ZONG');
      expect(zongPrefixes).toContain(310);
      expect(zongPrefixes).toContain(311);

      const scoPrefixes = getOperatorPrefixes('SCO');
      expect(scoPrefixes).toContain(355);
      expect(scoPrefixes).toHaveLength(1);
    });

    test('should return empty array for invalid operators', () => {
      expect(getOperatorPrefixes('INVALID')).toHaveLength(0);
    });

    test('should be case insensitive', () => {
      const prefixes1 = getOperatorPrefixes('JAZZ');
      const prefixes2 = getOperatorPrefixes('jazz');
      expect(prefixes1).toEqual(prefixes2);
    });
  });
});
