const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  webpack: {
    plugins: [
      new NodePolyfillPlugin({
        excludeAliases: [
          'console',
        ]
      })
    ],
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        fs: false,
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        crypto: require.resolve('crypto-browserify')
      };

      return webpackConfig;
    }
  }
};