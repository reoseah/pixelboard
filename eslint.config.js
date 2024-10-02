import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import perfectionist from 'eslint-plugin-perfectionist'
// import solid from 'eslint-plugin-solid'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // solid.configs['flat/typescript'],
  stylistic.configs['recommended-flat'],
  perfectionist.configs['recommended-natural'],
  {
    rules: {
      'perfectionist/sort-objects': false,
    },
  },
]
