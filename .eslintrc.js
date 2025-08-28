module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended'
  ],
  rules: {
    // Only essential rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'off', // Turn off base rule
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-duplicate-imports': 'error'
  },
  env: {
    node: true,
    es6: true,
    jest: true
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
    '*.js',
    '*.d.ts'
  ]
};