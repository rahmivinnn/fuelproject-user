const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      '@': './src',
      '@components': './src/components',
      '@screens': './src/screens',
      '@services': './src/services',
      '@store': './src/store',
      '@styles': './src/styles',
      '@utils': './src/utils',
      '@constants': './src/constants',
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
