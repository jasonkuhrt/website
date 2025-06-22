import eslintPluginAstro from 'eslint-plugin-astro'
import prettierConfig from 'eslint-config-prettier'

export default [
  ...eslintPluginAstro.configs['flat/recommended'],
  prettierConfig,
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.astro/', 'pnpm-lock.yaml'],
  },
]
