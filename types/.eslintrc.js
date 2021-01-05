const INDENT = {
  flatTernaryExpressions: true
};
const QUOTES = {
  avoidEscape: true
};

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Allow our tests to not have to manipulate arguments (e.g. ctx).
    '@typescript-eslint/no-unused-vars': 'off',

    // Additional rules not part of @typescript-eslint/recommended.
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/consistent-indexed-object-style': 'error',
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/method-signature-style': 'error',
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    '@typescript-eslint/no-dynamic-delete': 'error',
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-implicit-any-catch': 'error',
    '@typescript-eslint/no-parameter-properties': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/unified-signatures': 'error',

    // Extension rules (based on eslint-config-chartjs).
    '@typescript-eslint/brace-style': ['error', '1tbs'], 'brace-style': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'only-multiline'], 'comma-dangle': 'off',
    '@typescript-eslint/comma-spacing': 'error', 'comma-spacing': 'off',
    '@typescript-eslint/indent': ['error', 2, INDENT], indent: 'off',
    '@typescript-eslint/keyword-spacing': 'error', 'keyword-spacing': 'off',
    '@typescript-eslint/no-extra-parens': ['error', 'functions'], 'no-extra-parens': 'off',
    '@typescript-eslint/no-extra-semi': 'error', 'no-extra-semi': 'off',
    '@typescript-eslint/no-loop-func': 'error', 'no-loop-func': 'off',
    '@typescript-eslint/no-redeclare': 'error', 'no-redeclare': 'off',
    '@typescript-eslint/no-shadow': 'error', 'no-shadow': 'off',
    '@typescript-eslint/no-unused-expressions': 'error', 'no-unused-expressions': 'off',
    '@typescript-eslint/no-use-before-define': 'error', 'no-use-before-define': 'off',
    '@typescript-eslint/quotes': ['error', 'single', QUOTES], quotes: 'off',
    '@typescript-eslint/semi': ['error', 'always'], semi: 'off',
    '@typescript-eslint/space-before-function-paren': ['error', 'never'], 'space-before-function-paren': 'off',
    '@typescript-eslint/space-infix-ops': 'error', 'space-infix-ops': 'off',
  },
};
