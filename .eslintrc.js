module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  plugins: ['vue'],
  globals: {
    uni: 'readonly',
    plus: 'readonly',
    wx: 'readonly',
    swan: 'readonly',
    tt: 'readonly',
    my: 'readonly',
    getCurrentPages: 'readonly',
    getApp: 'readonly',
    UniApp: 'readonly',
    Page: 'readonly',
    App: 'readonly',
    Component: 'readonly'
  },
  rules: {
    // Vue 相关规则
    'vue/multi-word-component-names': 'off', // 允许单词组件名
    'vue/no-v-html': 'warn', // 警告使用v-html
    'vue/require-default-prop': 'off', // 不强制要求默认值
    'vue/require-prop-types': 'warn', // 警告缺少prop类型
    'vue/html-self-closing': ['error', {
      html: {
        void: 'always',
        normal: 'never',
        component: 'always'
      }
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1
    }],

    // JavaScript 规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-undef': 'error',
    'prefer-const': 'warn',
    'no-var': 'error',

    // 代码风格
    'indent': ['error', 2, { SwitchCase: 1 }],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'arrow-spacing': 'error',
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-trailing-spaces': 'error'
  }
}
