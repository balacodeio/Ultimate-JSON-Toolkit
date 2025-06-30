// eslint configuration that works well with bubble.io plugins

import js from '@eslint/js';
import htmlPlugin from 'eslint-plugin-html';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.html'],
    plugins: {
      html: htmlPlugin,
      "jquery": "eslint-plugin-jquery"
    },
    "env": {
      "browser": true,
      "jquery": true
    },
    rules: {
      'linebreak-style': 0,
      'func-names': 0,
      'space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }],
      'no-param-reassign': ['error', { props: false }],
      'consistent-return': 0,
      'prefer-const': 'off',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'eqeqeq': 'error'
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    }
  },
  {
    files: ['actions/server/**/*.js'],
    languageOptions: {
        sourceType: 'script'
    }
  }
];
