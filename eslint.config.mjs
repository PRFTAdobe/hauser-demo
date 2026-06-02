/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved,import/extensions */
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

const compat = new FlatCompat({});

const airbnbRules = compat
  .extends('airbnb-base')
  .reduce((compatElement, item) => {
    if (item.rules && typeof item.rules === 'object') {
      Object.assign(compatElement, item.rules);
    }
    return compatElement;
  }, {});

export default defineConfig([
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        global: 'readonly', // <-- Add this line
      },
      sourceType: 'module',
    },
    rules: {
      ...airbnbRules,
      'arrow-body-style': [0, 'as-needed'],
      'arrow-return-style/arrow-return-style': [2],
      'arrow-return-style/no-export-default-arrow': [2],
      'import/extensions': ['error', { js: 'always' }],
      'import/prefer-default-export': [0],
      'json/*': 'error',
      'linebreak-style': ['error', 'unix'],
      'max-classes-per-file': [1],
      'no-console': [
        1,
        {
          allow: ['error', 'warn', 'info'],
        },
      ],
      'no-param-reassign': [
        2,
        {
          props: false,
        },
      ],
      'no-plusplus': [
        2,
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      'no-use-before-define': [
        0,
        {
          allowNamedExports: false,
          classes: true,
          functions: true,
          variables: true,
        },
      ],
      'prettier/prettier': [2],
      'xwalk/invalid-field-name': [2],
      'xwalk/max-cells': [
        2,
        {
          '*': 50,
        },
      ],
      'xwalk/no-custom-resource-types': [2],
      'xwalk/no-duplicate-fields': [2],
      'xwalk/no-orphan-collapsible-fields': [2],
    },
  },
  perfectionist.configs['recommended-alphabetical'],
  prettierPlugin,
  ...compat.plugins('json', 'xwalk', 'arrow-return-style'),
  globalIgnores([
    'helix-importer-ui',
    './scripts/dompurify.min.js',
    './scripts/marked.min.js',
    './scripts/chart.min.js',
    './scripts/forms2.min.js',
  ]),
]);
