import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginReact from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/**']
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: eslintPluginReact
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      'react/react-in-jsx-scope': 'off'
    }
  }
];