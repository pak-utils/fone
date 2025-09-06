import {
  OPERATORS,
  getOperatorByPrefix,
  isValidMobilePrefix,
  getOperatorByCode,
  getAllOperatorCodes,
  getAllOperatorNames,
  OPERATOR_CONSTANTS,
} from '../data/operators';
import { OperatorData } from '../types';

describe('Operators Data', () => {
  describe('OPERATORS constant', () => {
    test('should have all required operators', () => {
      const expectedOperators = ['JAZZ', 'ZONG', 'UFONE', 'ONIC', 'TELENOR', 'SCO'];
      const actualOperators = OPERATORS.map(op => op.code);

      expect(actualOperators).toEqual(expect.arrayContaining(expectedOperators));
      expect(actualOperators).toHaveLength(expectedOperators.length);
    });

    test('should have valid operator structure', () => {
      OPERATORS.forEach((operator: OperatorData) => {
        expect(operator).toHaveProperty('code');
        expect(operator).toHaveProperty('name');
        expect(operator).toHaveProperty('prefixes');
        expect(Array.isArray(operator.prefixes)).toBe(true);
        expect(operator.prefixes.length).toBeGreaterThan(0);
      });
    });

    test('should have no duplicate prefixes across operators', () => {
      const allPrefixes: number[] = [];
      OPERATORS.forEach(operator => {
        allPrefixes.push(...operator.prefixes);
      });

      const uniquePrefixes = new Set(allPrefixes);
      expect(allPrefixes).toHaveLength(uniquePrefixes.size);
    });

    test('should have prefixes in valid range', () => {
      OPERATORS.forEach(operator => {
        operator.prefixes.forEach(prefix => {
          expect(prefix).toBeGreaterThanOrEqual(300);
          expect(prefix).toBeLessThanOrEqual(399);
        });
      });
    });
  });

  describe('getOperatorByPrefix', () => {
    test('should return correct operator for Jazz prefixes', () => {
      const jazzPrefixes = [300, 301, 302, 303, 320, 321];
      jazzPrefixes.forEach(prefix => {
        const operator = getOperatorByPrefix(prefix);
        expect(operator?.code).toBe('JAZZ');
        expect(operator?.name).toBe('Jazz');
      });
    });

    test('should return correct operator for Zong prefixes', () => {
      const zongPrefixes = [310, 311, 312, 313, 314, 315];
      zongPrefixes.forEach(prefix => {
        const operator = getOperatorByPrefix(prefix);
        expect(operator?.code).toBe('ZONG');
        expect(operator?.name).toBe('Zong');
      });
    });

    test('should return correct operator for Ufone prefixes', () => {
      const ufonePrefixes = [330, 331, 332, 333, 334];
      ufonePrefixes.forEach(prefix => {
        const operator = getOperatorByPrefix(prefix);
        expect(operator?.code).toBe('UFONE');
        expect(operator?.name).toBe('Ufone');
      });
    });

    test('should return correct operator for Telenor prefixes', () => {
      const telenorPrefixes = [340, 341, 342, 343, 344];
      telenorPrefixes.forEach(prefix => {
        const operator = getOperatorByPrefix(prefix);
        expect(operator?.code).toBe('TELENOR');
        expect(operator?.name).toBe('Telenor');
      });
    });

    test('should return correct operator for SCO prefix', () => {
      const operator = getOperatorByPrefix(355);
      expect(operator?.code).toBe('SCO');
      expect(operator?.name).toBe('Special Communications Organization');
    });

    test('should return undefined for invalid prefixes', () => {
      const invalidPrefixes = [200, 250, 400, 500, 999];
      invalidPrefixes.forEach(prefix => {
        expect(getOperatorByPrefix(prefix)).toBeUndefined();
      });
    });
  });

  describe('isValidMobilePrefix', () => {
    test('should return true for valid mobile prefixes', () => {
      const validPrefixes = [300, 310, 330, 339, 340, 355];
      validPrefixes.forEach(prefix => {
        expect(isValidMobilePrefix(prefix)).toBe(true);
      });
    });

    test('should return false for invalid prefixes', () => {
      const invalidPrefixes = [200, 250, 360, 400, 500];
      invalidPrefixes.forEach(prefix => {
        expect(isValidMobilePrefix(prefix)).toBe(false);
      });
    });

    test('should handle all operator prefixes correctly', () => {
      OPERATORS.forEach(operator => {
        operator.prefixes.forEach(prefix => {
          expect(isValidMobilePrefix(prefix)).toBe(true);
        });
      });
    });
  });

  describe('getOperatorByCode', () => {
    test('should return correct operator for valid codes', () => {
      expect(getOperatorByCode('JAZZ')?.name).toBe('Jazz');
      expect(getOperatorByCode('ZONG')?.name).toBe('Zong');
      expect(getOperatorByCode('UFONE')?.name).toBe('Ufone');
      expect(getOperatorByCode('TELENOR')?.name).toBe('Telenor');
      expect(getOperatorByCode('SCO')?.name).toBe('Special Communications Organization');
    });

    test('should be case insensitive', () => {
      expect(getOperatorByCode('jazz')?.code).toBe('JAZZ');
      expect(getOperatorByCode('Jazz')?.code).toBe('JAZZ');
      expect(getOperatorByCode('JAZZ')?.code).toBe('JAZZ');
    });

    test('should return undefined for invalid codes', () => {
      expect(getOperatorByCode('INVALID')).toBeUndefined();
      expect(getOperatorByCode('')).toBeUndefined();
      expect(getOperatorByCode('XYZ')).toBeUndefined();
    });
  });

  describe('getAllOperatorCodes', () => {
    test('should return all operator codes', () => {
      const codes = getAllOperatorCodes();
      expect(codes).toContain('JAZZ');
      expect(codes).toContain('ZONG');
      expect(codes).toContain('UFONE');
      expect(codes).toContain('TELENOR');
      expect(codes).toContain('SCO');
      expect(codes).toHaveLength(6);
    });

    test('should return immutable array', () => {
      const codes = getAllOperatorCodes();
      expect(() => {
        (codes as string[]).push('NEW_OPERATOR');
      }).toThrow();
    });
  });

  describe('getAllOperatorNames', () => {
    test('should return all operator names', () => {
      const names = getAllOperatorNames();
      expect(names).toContain('Jazz');
      expect(names).toContain('Zong');
      expect(names).toContain('Ufone');
      expect(names).toContain('Telenor');
      expect(names).toContain('Special Communications Organization');
      expect(names).toHaveLength(6);
    });
  });

  describe('OPERATOR_CONSTANTS', () => {
    test('should have correct total counts', () => {
      expect(OPERATOR_CONSTANTS.TOTAL_OPERATORS).toBe(6);
      expect(OPERATOR_CONSTANTS.TOTAL_PREFIXES).toBeGreaterThan(0);
    });

    test('should have correct prefix counts per operator', () => {
      expect(OPERATOR_CONSTANTS.JAZZ_PREFIXES).toBe(20); // 300-309, 320-329
      expect(OPERATOR_CONSTANTS.ZONG_PREFIXES).toBe(10); // 310-319
      expect(OPERATOR_CONSTANTS.UFONE_PREFIXES).toBe(9); // 330-338
      expect(OPERATOR_CONSTANTS.ONIC_PREFIXES).toBe(1); // 339
      expect(OPERATOR_CONSTANTS.TELENOR_PREFIXES).toBe(10); // 340-349
      expect(OPERATOR_CONSTANTS.SCO_PREFIXES).toBe(1); // 355
    });
  });

  describe('Performance tests', () => {
    test('should perform prefix lookups efficiently', () => {
      const startTime = performance.now();

      // Perform 10000 lookups
      for (let i = 0; i < 10000; i++) {
        getOperatorByPrefix(300);
        getOperatorByPrefix(310);
        getOperatorByPrefix(340);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within 300ms (CI-friendly threshold for GitHub Actions)
      expect(duration).toBeLessThan(300);
    });

    test('should perform validation efficiently', () => {
      const startTime = performance.now();

      // Perform 10000 validations
      for (let i = 0; i < 10000; i++) {
        isValidMobilePrefix(300);
        isValidMobilePrefix(400); // invalid
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within 200ms (CI-friendly threshold for GitHub Actions)
      expect(duration).toBeLessThan(200);
    });
  });
});
