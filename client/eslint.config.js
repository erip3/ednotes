import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import tailwindcss from 'eslint-plugin-tailwindcss';
import testingLibrary from 'eslint-plugin-testing-library';
import jestDom from 'eslint-plugin-jest-dom';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import checkFile from 'eslint-plugin-check-file';

import testingLibraryConfig from 'eslint-plugin-testing-library/dist/configs/react.js';

const jestDomConfig = jestDom.configs['flat/recommended'];
const reactHooksConfig = reactHooks.configs.recommended;
const reactRefreshConfig = reactRefresh.configs.recommended;

export default [
  js.configs.recommended,
  {
    ignores: [
      'node_modules/*',
      'public/mockServiceWorker.js',
      'generators/*',
      'dist',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      prettier,
      tailwindcss,
      'testing-library': testingLibrary,
      'jest-dom': jestDom,
      '@typescript-eslint': tseslint.plugin,
      'check-file': checkFile,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'no-unused-vars': 'off',

      // Import rules
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/features/articles',
              from: './src/features',
              except: ['./article'],
            },
            {
              target: './src/features/categories',
              from: './src/features',
              except: ['./categories'],
            },
            {
              target: './src/features/personal',
              from: './src/features',
              except: ['./personal'],
            },
            {
              target: './src/features/projects',
              from: './src/features',
              except: ['./projects'],
            },
            {
              target: './src/features',
              from: './src/app',
            },
            {
              target: [
                './src/components',
                './src/hooks',
                './src/lib',
                './src/types',
                './src/utils',
              ],
              from: ['./src/features', './src/app'],
            },
          ],
        },
      ],
      'import/no-cycle': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-named-as-default': 'off',

      // React rules
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // JSX a11y
      'jsx-a11y/anchor-is-valid': 'off',

      // Typescript rules
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // Prettier
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],

      // Tailwind
      'tailwindcss/classnames-order': 'warn',

      // Check-file
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],

      // Linebreak
      'linebreak-style': ['error', 'unix'],
    },
  },
  // Folder naming convention for non-test files
  {
    files: ['src/**/!(__tests__)/*'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/folder-naming-convention': [
        'error',
        {
          '**/*': 'KEBAB_CASE',
        },
      ],
    },
  },
  // Testing plugins
  {
    files: ['**/*.test.{ts,tsx,js,jsx}'],
    plugins: {
      'testing-library': testingLibrary,
      'jest-dom': jestDom,
    },
    ...testingLibraryConfig,
    ...jestDomConfig,
  },
  // React hooks and refresh
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    ...reactHooksConfig,
    ...reactRefreshConfig,
  },
];
