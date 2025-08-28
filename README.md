# @pak-utils/fone 📱

[![CI](https://github.com/pak-utils/fone/workflows/CI/badge.svg)](https://github.com/pak-utils/fone/actions)
[![npm version](https://badge.fury.io/js/@pak-utils%2Ffone.svg)](https://www.npmjs.com/package/@pak-utils/fone)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A comprehensive, zero-dependency npm package for **Pakistani phone number** validation, formatting, and operator detection with **full Urdu digit support**.

## ✨ Features

- 🚀 **Zero Dependencies** - Pure TypeScript/JavaScript implementation
- 📱 **Complete Operator Support** - Jazz, Zong, Ufone, Telenor, SCO, Onic
- 🎯 **100% TypeScript Support** - Full type definitions included
- 🔄 **Multiple Formats** - National, international, E.164, compact, dots, dashes, parentheses
- ⚡ **High Performance** - Optimized for speed and minimal memory usage
- 🛡️ **Comprehensive Validation** - Strict and loose validation modes
- 🌐 **Universal Compatibility** - Works in Node.js, browsers, and all frameworks
- 🧪 **Comprehensive Testing** - 316+ test cases with real-world scenarios

## 📥 Installation

```bash
npm install @pak-utils/fone
```

## 🚀 Quick Start

```javascript
import { validate, format, detectOperator } from '@pak-utils/fone';

// Validate Pakistani mobile numbers
console.log(validate('03001234567')); // true
console.log(validate('0300-123-4567')); // true
console.log(validate('+92 300 1234567')); // true

// Urdu digits support
console.log(validate('۰۳۰۰۱۲۳۴۵۶۷')); // true

// Format phone numbers
console.log(format('03001234567', 'international')); // '+92 300 1234567'
console.log(format('03001234567', 'e164')); // '+923001234567'

// Detect operators
console.log(detectOperator('03001234567')); 
// { code: 'JAZZ', name: 'Jazz', type: 'mobile' }
```

## 📖 API Reference

### Validation Functions

#### `validate(phone: string): boolean`
Quick validation for Pakistani phone numbers.

```javascript
import { validate } from '@pak-utils/fone';

validate('03001234567');        // true
validate('0300-123-4567');      // true  
validate('+92 300 1234567');    // true
validate('۰۳۰۰۱۲۳۴۵۶۷');     // true (Urdu digits)
validate('invalid');            // false
```

#### `validateStrict(phone: string, options?: ValidationOptions): ValidationResult`
Detailed validation with comprehensive error reporting.

```javascript
import { validateStrict } from '@pak-utils/fone';

const result = validateStrict('03001234567');
// {
//   isValid: true,
//   errors: [],
//   phoneNumber: { raw: '03001234567', formatted: '0300 1234567', ... }
// }

// Custom pattern validation
validateStrict('1234567890', {
  customPattern: /^\d{10}$/,
  allowInternational: false,
  strictMode: true
});
```

#### `isValid(phone: string): boolean`
Alias for `validate()` function.

#### `isMobile(phone: string): boolean`
Check if number is a mobile number.

```javascript
import { isMobile } from '@pak-utils/fone';

isMobile('03001234567');  // true
isMobile('invalid');      // false
```

### Formatting Functions

#### `format(phone: string, style?: FormatStyle): string`
Format phone numbers in different styles.

```javascript
import { format } from '@pak-utils/fone';

const phone = '03001234567';
format(phone, 'national');      // '0300 1234567'
format(phone, 'international'); // '+92 300 1234567'  
format(phone, 'e164');         // '+923001234567'
format(phone, 'compact');      // '03001234567'
format(phone, 'dots');         // '0300.123.4567'
format(phone, 'dashes');       // '0300-123-4567'
format(phone, 'parentheses');  // '(0300) 1234567'
```

#### `formatInternational(phone: string): string`
Format to international style (+92 300 1234567).

#### `formatLocal(phone: string): string`
Format to national style (0300 1234567).

#### `formatE164(phone: string): string`
Format to E164 style (+923001234567).

#### `formatCompact(phone: string): string`
Format to compact style (03001234567).

#### `formatCustom(phone: string, options: CustomFormatOptions): string`
Custom formatting with templates.

```javascript
import { formatCustom } from '@pak-utils/fone';

formatCustom('03001234567', {
  template: (prefix, subscriber) => `${prefix}•${subscriber.slice(0,3)}•${subscriber.slice(3)}`
}); // '300•123•4567'

formatCustom('03001234567', {
  pattern: /^03\d{9}$/,
  template: (prefix, subscriber) => `[${prefix}] ${subscriber}`
}); // '[300] 1234567'
```

#### `convertFormat(phone: string, fromStyle: FormatStyle, toStyle: FormatStyle): string`
Convert between format styles.

#### `matchesFormat(phone: string, style: FormatStyle): boolean`
Check if phone matches specific format.

#### `detectFormat(phone: string): FormatStyle | null`
Auto-detect current format style.

#### `stripFormatting(phone: string): string`
Remove all formatting characters.

#### `ensureFormat(phone: string, targetStyle?: FormatStyle): string`
Safe formatting that doesn't throw on invalid input.

### Operator Detection Functions

#### `detectOperator(phone: string): OperatorInfo | null`
Get operator information from phone number.

```javascript
import { detectOperator } from '@pak-utils/fone';

detectOperator('03001234567');
// { code: 'JAZZ', name: 'Jazz', type: 'mobile', network: 'GSM' }

detectOperator('03101234567');
// { code: 'ZONG', name: 'Zong', type: 'mobile', network: 'GSM' }
```

#### Operator Check Functions
- `isJazz(phone: string): boolean` - Check if Jazz number
- `isZong(phone: string): boolean` - Check if Zong number  
- `isUfone(phone: string): boolean` - Check if Ufone number
- `isTelenor(phone: string): boolean` - Check if Telenor number
- `isSCO(phone: string): boolean` - Check if SCO number
- `isOnic(phone: string): boolean` - Check if Onic number

#### `isOperator(phone: string, operatorCode: string): boolean`
Check if phone belongs to specific operator.

```javascript
import { isOperator } from '@pak-utils/fone';

isOperator('03001234567', 'JAZZ');    // true
isOperator('03001234567', 'ZONG');    // false
```

#### `getOperatorInfo(phone: string): OperatorInfo & { prefix: number } | null`
Get detailed operator info with prefix.

#### `getSupportedOperators(): readonly OperatorInfo[]`
Get list of all supported operators.

#### `isSupportedOperator(operatorCode: string): boolean`
Check if operator code is supported.

#### `getOperatorStats(phoneNumbers: string[]): Record<string, number>`
Get operator statistics from phone number array.

#### `filterByOperator(phoneNumbers: string[], operatorCode: string): string[]`
Filter numbers by operator.

#### `groupByOperator(phoneNumbers: string[]): Record<string, string[]>`
Group numbers by operator.

#### `isPrefixOfOperator(prefix: number, operatorCode: string): boolean`
Check if prefix belongs to operator.

#### `getOperatorPrefixes(operatorCode: string): readonly number[]`
Get all prefixes for operator.

### Utility Functions

#### `parse(phone: string): PhoneNumber | null`
Parse phone number into structured object.

```javascript
import { parse } from '@pak-utils/fone';

const parsed = parse('03001234567');
// {
//   raw: '03001234567',
//   formatted: '0300 1234567',
//   international: '+92 300 1234567',
//   local: '0300 1234567',
//   operator: { code: 'JAZZ', name: 'Jazz', type: 'mobile' },
//   isValid: true,
//   type: 'mobile',
//   prefix: 300,
//   subscriberNumber: '1234567'
// }
```

#### `normalize(phone: string): string`
Normalize phone number to standard format.

```javascript
import { normalize } from '@pak-utils/fone';

normalize('+92 300 1234567');  // '03001234567'
normalize('0300-123-4567');    // '03001234567'
normalize('923001234567');     // '03001234567'
```


#### `randomPhoneNumber(options?: GeneratorOptions): string | string[]`
Generate random Pakistani phone numbers.

```javascript
import { randomPhoneNumber } from '@pak-utils/fone';

randomPhoneNumber();                           // '03001234567' (random)
randomPhoneNumber({ operator: 'JAZZ' });      // Jazz number
randomPhoneNumber({ format: 'international' }); // '+92 300 1234567'
randomPhoneNumber({ count: 3 });              // Array of 3 numbers
randomPhoneNumber({ 
  operator: 'ZONG', 
  format: 'national',
  count: 2 
}); // Array of 2 Zong numbers in national format
```

#### String Utility Functions
- `isNumeric(str: string): boolean` - Check if string is numeric
- `digitsOnly(str: string): string` - Extract only digits
- `ensureCountryCode(phone: string): string` - Add country code if missing
- `removeCountryCode(phone: string): string` - Remove country code
- `isSameNumber(phone1: string, phone2: string): boolean` - Compare two numbers
- `deduplicate(phoneNumbers: string[]): string[]` - Remove duplicate numbers
- `sortPhoneNumbers(phoneNumbers: string[]): string[]` - Sort numbers

### Batch Processing Functions

#### `validateBatch(phoneNumbers: string[]): boolean[]`
Validate multiple numbers at once.

```javascript
import { validateBatch } from '@pak-utils/fone';

const numbers = ['03001234567', '03101234567', 'invalid'];
validateBatch(numbers); // [true, true, false]
```

#### `formatBatch(phoneNumbers: string[], style?: FormatStyle): string[]`
Format multiple numbers.

```javascript
import { formatBatch } from '@pak-utils/fone';

const numbers = ['03001234567', '03101234567'];
formatBatch(numbers, 'international');
// ['+92 300 1234567', '+92 310 1234567']
```

#### `parseBatch(phoneNumbers: string[]): (PhoneNumber | null)[]`
Parse multiple numbers.

#### Additional Batch Functions
- `extractOperators(phoneNumbers: string[]): OperatorInfo[]` - Get unique operators
- `cleanBatch(phoneNumbers: string[]): string[]` - Clean multiple numbers
- `convertBatch(phoneNumbers: string[], targetFormat: FormatStyle): string[]` - Convert formats
- `filterValid(phoneNumbers: string[]): string[]` - Filter valid numbers
- `filterInvalid(phoneNumbers: string[]): string[]` - Filter invalid numbers

### Urdu Digit Functions

#### `urduToEnglishDigits(input: string): string`
Convert Urdu digits to English.

```javascript
import { urduToEnglishDigits } from '@pak-utils/fone';

urduToEnglishDigits('۰۳۰۰۱۲۳۴۵۶۷'); // '03001234567'
```

#### `englishToUrduDigits(input: string): string`
Convert English digits to Urdu.

#### `normalizeDigits(input: string): string`
Normalize mixed digits to English.

#### `hasUrduDigits(input: string): boolean`
Check if string contains Urdu digits.

#### `hasOnlyValidDigits(input: string): boolean`
Check if string contains only valid digits.

#### `sanitizePhoneInput(input: string): string`
Sanitize input for phone processing.

#### `isSafePhoneInput(input: string): boolean`
Check if input is safe (no malicious patterns).

#### `normalizePhoneNumber(phone: string): string`
Normalize phone number with digit conversion.

## 🏢 Supported Operators

| Operator | Code | Name | Prefixes |
|----------|------|------|----------|
| Jazz | `JAZZ` | Jazz (Mobilink) | 300-309, 320-329 |
| Zong | `ZONG` | Zong (CMPak) | 310-319 |
| Ufone | `UFONE` | Ufone | 330-338 |
| Onic | `ONIC` | Onic | 339 |
| Telenor | `TELENOR` | Telenor | 340-349 |
| SCO | `SCO` | Special Communications Organization | 355 |

## 🔧 TypeScript Support

```typescript
import { 
  PhoneNumber, 
  OperatorInfo, 
  FormatStyle, 
  ValidationResult,
  ValidationOptions,
  GeneratorOptions,
  CustomFormatOptions 
} from '@pak-utils/fone';

const formatStyle: FormatStyle = 'international';
const result: ValidationResult = validateStrict('03001234567');
const options: ValidationOptions = { strictMode: true };
```

## ⚡ Performance

- **Validation**: >100,000 operations/second
- **Bundle Size**: <10KB minified + gzipped
- **Zero Dependencies**: No external dependencies
- **Memory Efficient**: <1MB for typical usage

## 🧪 Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build package  
npm run build

# Run linting
npm run lint

# Type checking
npm run typecheck

# Generate changelog
npm run changelog

# Release (patch/minor/major)
npm run release
npm run release:minor
npm run release:major
```

## 🎯 Use Cases

- **Form Validation** - Validate user input in registration forms
- **Data Processing** - Clean and normalize phone number databases
- **Analytics** - Analyze phone number patterns by operator
- **Testing** - Generate realistic test data
- **API Development** - Validate phone numbers in REST APIs
- **SMS Services** - Route messages based on operator detection

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Made with ❤️ for the Pakistani developer community