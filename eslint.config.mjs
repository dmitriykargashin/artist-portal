import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Vue rules - relax for demo project
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off', // Using TypeScript for prop types
    'vue/no-unused-vars': 'off', // Often v-for index is needed for keys but not used otherwise
    
    // TypeScript rules
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    
    // General rules
    'no-console': 'off' // Allow console for demo/seed scripts
  }
})
