/* eslint-disable import/no-unresolved */
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
// eslint-disable-next-line import/extensions
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

const compat = new FlatCompat({});

export default defineConfig([
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  perfectionist.configs['recommended-alphabetical'],
  prettierPlugin,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      sourceType: 'module',
    },
    rules: {
      ...compat.extends('airbnb-base').rules,
      'arrow-body-style': ['warn', 'as-needed'],
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
      'prettier/prettier': [2],
      'sort-keys': [
        0,
        'asc',
        {
          allowLineSeparatedGroups: false,
          caseSensitive: true,
          ignoreComputedKeys: false,
          minKeys: 2,
          natural: false,
        },
      ],
      'sort-keys/sort-keys-fix': [2],
    },
  },
  ...compat.plugins('sort-keys', 'json', 'xwalk'),
  globalIgnores(['helix-importer-ui', './scripts/dompurify.min.js']),
]);
