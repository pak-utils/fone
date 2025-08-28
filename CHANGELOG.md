# Changelog

## [1.1.1] - 2025-08-28

### Changes since v1.1.0:

**fix: enhance validation and clean up API**

  - Add strict 14-digit maximum length validation for Pakistani mobile numbers
  - Simplify PhoneNumberType from 'mobile' | 'unknown' to 'mobile' only
  - Remove VERSION and packageInfo exports from main API
  - Fix input sanitization length limit from 50 to 30 characters
  - Maintain backward compatibility for all core functions



## [1.1.0] - 2025-08-28

### Changes since v1.0.0:

**fix: improve changelog generation to capture full commit messages**

  - Now captures both commit subject and body
  - Shows subject in bold, body as bullet points
  - Proper spacing and formatting for better readability



All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-08-28

### Initial release

**feat: initial release of Pakistani phone number utilities**

- Zero-dependency phone number validation for Pakistani numbers
- Support for all major operators (Jazz, Zong, Ufone, Telenor, SCO, Onic)  
- Multiple formatting styles (national, international, E164, compact, dots, dashes)
- Full Urdu digits support with automatic conversion
- Comprehensive validation with strict and loose modes
- Batch processing utilities for multiple numbers
- Random phone number generation for testing
- TypeScript support with complete type definitions  
- 297 comprehensive test cases covering real-world scenarios
- Cross-platform compatibility (Node.js, browsers, all frameworks)