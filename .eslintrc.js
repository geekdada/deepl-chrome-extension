module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  globals: {
    chrome: 'readonly',
  },
  rules: {
    semi: ['error', 'never', { beforeStatementContinuationChars: 'never' }],
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-var-requires': 0,
    'react/prop-types': 0,
  },
}
