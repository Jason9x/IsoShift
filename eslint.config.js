import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true
				}
			}
		},
		plugins: {
			'@typescript-eslint': tsPlugin
		},
		rules: {
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-module-boundary-types': [
				'warn',
				{
					allowArgumentsExplicitlyTypedAsAny: true,
					allowHigherOrderFunctions: true
				}
			],
			curly: ['error', 'multi-or-nest'],
			'arrow-body-style': ['error', 'as-needed']
		}
	},
	eslintConfigPrettier,
	{
		ignores: ['dist/**', 'node_modules/**']
	}
]
