/* eslint-env node */

const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkerPlugin = require('worker-plugin')
const { version } = require('./package.json')

const BUILD_FOLDER = path.join(__dirname, 'build')

module.exports = {
  mode: 'development',
  entry: [
    '@babel/polyfill',
    './src/index.js'
  ],
  output: {
    path: BUILD_FOLDER,
    filename: 'bundle.js'
  },
  plugins: [
    new CopyWebpackPlugin([
      { context: './src', from: '*.html' },
      { context: './src', from: '*.css' }
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      version
    }),
    new WorkerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: BUILD_FOLDER
  }
}