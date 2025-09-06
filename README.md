# @pak-utils/fone 📱

[![CI](https://github.com/pak-utils/fone/workflows/CI/badge.svg)](https://github.com/pak-utils/fone/actions)
[![npm version](https://img.shields.io/npm/v/@pak-utils/fone.svg)](https://www.npmjs.com/package/@pak-utils/fone)
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
- 🧪 **Comprehensive Testing** - Extensive test coverage with real-world scenarios

## 📥 Installation

```bash
npm install @pak-utils/fone
```

## 🚀 Quick Start

Get up and running in seconds with the most flexible Pakistani phone number library:

```javascript
import { validate, format, detectOperator } from '@pak-utils/fone';

// ✅ Validation - Accepts any format
validate('03001234567'); // true - standard format
validate('0300-123-4567'); // true - with dashes
validate('+92 300 1234567'); // true - international
validate('۰۳۰۰۱۲۳۴۵۶۷'); // true - Urdu digits!
validate('92 300 1234567'); // true - without + sign

// 🎨 Formatting - Convert to any style
format('03001234567', 'international'); // '+92 300 1234567'
format('03001234567', 'e164'); // '+923001234567'
format('03001234567', 'dashes'); // '0300-123-4567'
format('03001234567', 'dots'); // '0300.123.4567'

// 📡 Operator Detection - Know the network
detectOperator('03001234567'); // { code: 'JAZZ', name: 'Jazz', type: 'mobile' }
detectOperator('03101234567'); // { code: 'ZONG', name: 'Zong', type: 'mobile' }
```

### Real-World Examples

```javascript
// 🔍 Form Validation
function validatePhoneInput(phone) {
  if (!validate(phone)) {
    return 'Please enter a valid Pakistani phone number';
  }
  return null;
}

// 🧹 Clean user input to standard format
function cleanPhoneInput(phone) {
  return normalize(phone); // '03001234567'
}

// 🖼️ Display formatting for UI
function displayPhone(phone) {
  return format(phone, 'national'); // '0300 1234567'
}

// 💾 Store in database as international standard
function storePhone(phone) {
  return format(phone, 'e164'); // '+923001234567'
}

// 📊 Analyze by operator
function getOperatorStats(phoneNumbers) {
  return phoneNumbers.map(phone => ({
    phone,
    operator: detectOperator(phone)?.name || 'Unknown',
  }));
}
```

## 📖 API Reference

### Validation Functions

#### `validate(phone: string): boolean`

**The go-to function for quick validation.** Returns `true` if the input is a valid Pakistani phone number in any format.

- ✅ Supports all common input formats (national, international, formatted)
- ✅ Handles Urdu digits automatically
- ✅ Very fast - optimized for high-volume validation
- ❌ No detailed error information (use `validateStrict` for that)

```javascript
import { validate } from '@pak-utils/fone';

validate('03001234567'); // true
validate('0300-123-4567'); // true
validate('+92 300 1234567'); // true
validate('۰۳۰۰۱۲۳۴۵۶۷'); // true (Urdu digits)
validate('invalid'); // false
```

#### `validateStrict(phone: string, options?: ValidationOptions): ValidationResult`

**Advanced validation with detailed error reporting.** Perfect when you need to know exactly what's wrong with invalid input.

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
  strictMode: true,
});
```

#### `isValid(phone: string): boolean`

Alias for `validate()` function.

#### `isMobile(phone: string): boolean`

Check if number is a mobile number.

```javascript
import { isMobile } from '@pak-utils/fone';

isMobile('03001234567'); // true
isMobile('invalid'); // false
```

### Formatting Functions

#### `format(phone: string, style?: FormatStyle): string`

**The most versatile formatting function.** Converts valid Pakistani phone numbers to your preferred display format.

**Available styles:** `national`, `international`, `e164`, `compact`, `dots`, `dashes`, `parentheses`

```javascript
import { format } from '@pak-utils/fone';

const phone = '03001234567';
format(phone, 'national'); // '0300 1234567'
format(phone, 'international'); // '+92 300 1234567'
format(phone, 'e164'); // '+923001234567'
format(phone, 'compact'); // '03001234567'
format(phone, 'dots'); // '0300.123.4567'
format(phone, 'dashes'); // '0300-123-4567'
format(phone, 'parentheses'); // '(0300) 1234567'
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
  template: (prefix, subscriber) => `${prefix}•${subscriber.slice(0, 3)}•${subscriber.slice(3)}`,
}); // '300•123•4567'

formatCustom('03001234567', {
  pattern: /^03\d{9}$/,
  template: (prefix, subscriber) => `[${prefix}] ${subscriber}`,
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

**Instantly identify the telecom operator** from any Pakistani phone number. Returns `null` for invalid numbers.

```javascript
import { detectOperator } from '@pak-utils/fone';

detectOperator('03001234567');
// { code: 'JAZZ', name: 'Jazz', network: 'GSM' }

detectOperator('03101234567');
// { code: 'ZONG', name: 'Zong', network: 'GSM' }
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

isOperator('03001234567', 'JAZZ'); // true
isOperator('03001234567', 'ZONG'); // false
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
//   raw: '03001234567',              // Original input
//   formatted: '0300 1234567',       // National format (with spaces)
//   international: '+92 300 1234567', // International format
//   operator: { code: 'JAZZ', name: 'Jazz' },
//   isValid: true,
//   prefix: 300,                     // Operator prefix number
//   subscriberNumber: '1234567'      // The subscriber part
// }
```

#### `normalize(phone: string): string`

Normalize phone number to standard format.

```javascript
import { normalize } from '@pak-utils/fone';

normalize('+92 300 1234567'); // '03001234567'
normalize('0300-123-4567'); // '03001234567'
normalize('923001234567'); // '03001234567'
```

#### `randomPhoneNumber(options?: GeneratorOptions): string | string[]`

Generate random Pakistani phone numbers.

```javascript
import { randomPhoneNumber } from '@pak-utils/fone';

randomPhoneNumber(); // '03001234567' (random)
randomPhoneNumber({ operator: 'JAZZ' }); // Jazz number
randomPhoneNumber({ format: 'international' }); // '+92 300 1234567'
randomPhoneNumber({ count: 3 }); // Array of 3 numbers
randomPhoneNumber({
  operator: 'ZONG',
  format: 'national',
  count: 2,
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

| Operator | Code      | Name                                | Prefixes         |
| -------- | --------- | ----------------------------------- | ---------------- |
| Jazz     | `JAZZ`    | Jazz (Mobilink)                     | 300-309, 320-329 |
| Zong     | `ZONG`    | Zong (CMPak)                        | 310-319          |
| Ufone    | `UFONE`   | Ufone                               | 330-338          |
| Onic     | `ONIC`    | Onic                                | 339              |
| Telenor  | `TELENOR` | Telenor                             | 340-349          |
| SCO      | `SCO`     | Special Communications Organization | 355              |

## 🔧 TypeScript Support

```typescript
import {
  validate,
  validateStrict,
  format,
  detectOperator,
  // Types
  PhoneNumber,
  OperatorInfo,
  FormatStyle,
  ValidationResult,
  ValidationOptions,
  GeneratorOptions,
  CustomFormatOptions,
} from '@pak-utils/fone';

// Using with types
const formatStyle: FormatStyle = 'international';
const phoneNumber = '03001234567';

const result: ValidationResult = validateStrict(phoneNumber);
const operator: OperatorInfo | null = detectOperator(phoneNumber);
const formatted: string = format(phoneNumber, formatStyle);

const options: ValidationOptions = {
  strictMode: true,
  allowInternational: false,
};
```

## ⚡ Performance

- **High Speed**: Optimized validation and formatting operations
- **Small Bundle**: Minimal size when minified and gzipped
- **Zero Dependencies**: No external dependencies
- **Memory Efficient**: Low memory footprint for typical usage

## 🧪 Development

```bash
# Install dependencies
npm install

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run tests with coverage
npm run test:coverage

# Build package
npm run build

# Check bundle size
npm run size

# Run all checks (recommended before committing)
npm run lint && npm run typecheck && npm test && npm run build
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Made with ❤️ for the Pakistani developer community
