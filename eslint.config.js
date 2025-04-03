const eslint = require('@eslint/js')
const tseslint = require('typescript-eslint')
const nextPlugin = require('@next/eslint-plugin-next')
const a11yPlugin = require('eslint-plugin-jsx-a11y')
const prettierPlugin = require('eslint-plugin-prettier')
const prettierConfig = require('eslint-config-prettier')

module.exports = tseslint.config(
  {
    ignores: [
      'node_modules',
      'scripts',
      '.eslintrc.js',
      'archive/*',
      'test-rehype/**',
      'sims/**',
      'eslint.config.js',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      globals: {
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'jsx-a11y': a11yPlugin,
      prettier: prettierPlugin,
      '@next/next': nextPlugin,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      { files: ['**/*.ts', '**/*.tsx'], rules: nextPlugin.configs.recommended.rules },
      { files: ['**/*.ts', '**/*.tsx'], rules: nextPlugin.configs['core-web-vitals'].rules },
    ],
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'no-constant-binary-expression': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
      'react/prop-types': 0,
      '@typescript-eslint/no-unused-vars': 0,
      'react/no-unescaped-entities': 0,
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      ...prettierConfig.rules,
    },
  }
)
