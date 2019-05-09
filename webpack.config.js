let path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { rules, plugins, loaders } = require('webpack-atoms');
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin');

function fromRootDir(matchPath) {
  return new RegExp(process.cwd() + matchPath);
}
module.exports = {
  mode: 'production',
  cache: true,
  name: 'firebase',
  devtool: 'eval',
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
  },
  output: {
    filename: '[name].bundle.mjs',
    chunkFilename: '[name].bundle.mjs',
    library: 'bundle',
  },
  module: {
    rules: [
      rules.js(),
      rules.images(),
      rules.css(),
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
    plugins.loaderOptions(),
    new WorkboxPlugin.GenerateSW({

      exclude: [/\.(?:png|jpg|jpeg|svg)$/],

      runtimeCaching: [{

        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

        handler: 'CacheFirst',

        options: {

          cacheName: 'images',
          expiration: {
            maxEntries: 10,
          },
        }

      }]

    }),
    new CompressionPlugin(
        {
          test: /\.js/,
          include: /\/includes/,
          exclude: /\/excludes/,
          cache: true
        }
    ),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/manifest/manifest.json'),
        to: './',
        ignore: ['.*']
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/favicon.ico'),
        to: './',
        ignore: ['.*']
      }
    ]),
    new HtmlWebpackPlugin({
      // filename: config.build.index,
      title: process.env.npm_package_description,
      template: './src/index.html',
      filename: './index.html',
      inject: true,
      // minify: {
      //     removeComments: true,
      //     collapseWhitespace: true,
      //     removeAttributeQuotes: true
      // },
      // chunksSortMode: 'dependency',

    })
  ],
}