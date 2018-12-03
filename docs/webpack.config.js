var path = require('path')
var pack = require('../package.json')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var PROD = process.env.NODE_ENV === 'production'
var TEST = process.env.NODE_ENV === 'test'

var config = {
  entry: path.resolve('docs/index.js'),
  output: {
    path: path.resolve('docs'),
    filename: 'bundle.js',
    library: 'EmojiMart',
    libraryTarget: 'umd',
  },

  externals: [],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve('src'),
          path.resolve('docs'),
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [
          path.resolve('src'),
          path.resolve('docs'),
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ],
  },

  resolve: {
    extensions: ['.vue', '.js'],
  },

  plugins: [
    new webpack.DefinePlugin({
      EMOJI_DATASOURCE_VERSION: `'${pack.devDependencies['emoji-datasource']}'`,
    }),
    new CopyWebpackPlugin([
      'css/emoji-mart.css',
    ])
  ],

  bail: true,
}

module.exports = config
