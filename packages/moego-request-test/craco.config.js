const CracoLessPlugin = require('craco-less');
const CracoAlias = require("craco-alias");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const loaders = webpackConfig.module.rules[1].oneOf;
      const babelLoader = loaders.find((i) => i.loader.includes('babel-loader'));
      babelLoader.include = [babelLoader.include, /moe-request-core/]
      return webpackConfig;
    }
  },
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    
    return devServerConfig;
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: ".",
        tsConfigPath: './tsconfig.extend.json',
      }
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
}
