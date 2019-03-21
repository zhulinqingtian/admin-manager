// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [ 2, { 'x-invalid-end-tag': false }],

    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    "comma-dangle": ["error", "never"],
    'arrow-parens': ["error", "as-needed"],
    'eqeqeq': ["error", "smart"],
    'max-len': 0,
    'linebreak-style': 0,
    'arrow-body-style': 0,
    'no-else-return': 0,
    "object-shorthand": 0,
    'semicolon': 0,
    'prefer-template': 0,
    'operator-assignment': 0,
    'func-names': 0,
    'no-param-reassign': 0,
    'prefer-destructuring': 0,
    'no-unused-expressions': 0,
    'no-shadow': 0,
    'global-require': 0,
    'object-curly-spacing': 0,
    'prefer-arrow-callback': 0,
    'no-trailing-spaces': 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
    'no-alert': 0,
    'no-nested-ternary': 0
  }
}
