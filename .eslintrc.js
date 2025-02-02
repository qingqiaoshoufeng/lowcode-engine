module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
  ],
  // '@vue/standard'
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    "indent": 'off',
    'vue/no-mutating-props': 'off'
  }
}
