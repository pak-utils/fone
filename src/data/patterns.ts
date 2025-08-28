/**
 * Regular expression patterns for Pakistani phone number validation and parsing
 */



/**
 * Pakistani mobile number patterns
 */
export const PATTERNS = {
  /**
   * Complete mobile number patterns
   */
  MOBILE: {
    // National format: 0300 1234567, 03001234567, or (0300) 1234567
    NATIONAL: /^\(?0(3(?:[0-4][0-9]|55|39))\)?\s?(\d{7})$/,

    // International format: +92 300 1234567, +923001234567, +92 (300) 1234567, or 0092 (300) 1234567
    INTERNATIONAL: /^(?:\+|00)?92\s?\(?(3(?:[0-4][0-9]|55|39))\)?\s?(\d{7})$/,

    // E.164 format: +923001234567 or +92 (300) 1234567
    E164: /^\+92\s?\(?(3(?:[0-4][0-9]|55|39))\)?(\d{7})$/,

    // Loose pattern for any mobile number
    LOOSE: /^(?:\+92|0092|92|\(?0)?\s?\(?(3(?:[0-4][0-9]|55|39))\)?\s?(\d{7})$/,

    // Strict validation pattern
    STRICT: /^(?:(?:\+92)|(?:0092)|(?:92)|(?:\(?0))?\s?\(?(3(?:[0-4][0-9]|55|39))\)?\s?(\d{7})$/,
  },

  /**
   * Prefix extraction patterns
   */
  PREFIX: {
    // Extract 3-digit mobile prefix
    MOBILE: /^(?:(?:\+92)|(?:0092)|(?:92)|(?:\(?0))?\s?\(?(3(?:[0-4][0-9]|55|39))\)?/,

    // Extract any prefix
    ANY: /^(?:(?:\+92)|(?:0))?([2-9]\d{1,2})/,
  },

  /**
   * Cleaning and normalization patterns
   */
  CLEAN: {
    // Remove all non-digit characters except +
    NON_DIGITS: /[^\d+]/g,

    // Remove spaces, dashes, dots, parentheses, underscores
    FORMATTING: /[\s\-.()\\_]/g,

    // Leading zeros after country code
    LEADING_ZEROS: /^(?:\+92)0+/,

    // Multiple spaces
    MULTIPLE_SPACES: /\s{2,}/g,

    // Urdu digits pattern
    URDU_DIGITS: /[۰-۹]/g,

    // All non-essential characters for normalization
    NON_ESSENTIAL: /[^\d+۰-۹]/g,
  },

  /**
   * Format detection patterns
   */
  DETECTION: {
    // Has country code
    HAS_COUNTRY_CODE: /^(?:\+|00)?92/,

    // Has leading zero
    HAS_LEADING_ZERO: /^0/,

    // Is E.164 format
    IS_E164: /^\+92\d{10}$/,

    // Has formatting (spaces, dashes, dots)
    HAS_FORMATTING: /[\s\-.()]/,

    // Is purely numeric
    IS_NUMERIC: /^\d+$/,
  },
} as const;


/**
 * Format templates for different formatting styles
 */
export const FORMAT_TEMPLATES = {
  NATIONAL: (prefix: string, subscriber: string) => `0${prefix} ${subscriber}`,
  INTERNATIONAL: (prefix: string, subscriber: string) => `+92 ${prefix} ${subscriber}`,
  E164: (prefix: string, subscriber: string) => `+92${prefix}${subscriber}`,
  COMPACT: (prefix: string, subscriber: string) => `0${prefix}${subscriber}`,
  DOTS: (prefix: string, subscriber: string) =>
    `0${prefix}.${subscriber.slice(0, 3)}.${subscriber.slice(3)}`,
  DASHES: (prefix: string, subscriber: string) =>
    `0${prefix}-${subscriber.slice(0, 3)}-${subscriber.slice(3)}`,
  PARENTHESES: (prefix: string, subscriber: string) => `(0${prefix}) ${subscriber}`,
} as const;
