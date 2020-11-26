module.exports = {
  root: false,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: [ 2, 'always' ],
    'comma-dangle': [ 0 ],
    'array-bracket-spacing': [ 0 ],
    '@typescript-eslint/no-explicit-any': [ 0 ],
    'key-spacing': [ 0 ],
    'no-multi-spaces': [ 0 ],
    '@typescript-eslint/ban-ts-ignore': [ 0 ],
    'padded-blocks': [ 0 ],
  }
}
