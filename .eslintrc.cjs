module.exports = {
  env: { es2021: true, node: true, browser: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: { 
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], 
    'no-var': 'error',
    'prefer-const': 'error',
    'no-console': 'warn'
  }
};
