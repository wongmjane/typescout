const __DEV__ = process.env.NODE_ENV === 'development'

const config = {
  presets: ['next/babel'],
  plugins: [],
}

if (!__DEV__) {
  config.plugins.push(['babel-plugin-optimize-clsx'])
}

module.exports = config
