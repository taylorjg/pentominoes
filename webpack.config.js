const path = require('path')
const { version } = require('./package.json')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const distFolder = path.join(__dirname, 'dist')

module.exports = {
  mode: 'development',
  entry: [
    './src/index.js'
  ],
  output: {
    path: distFolder,
    filename: 'bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { context: './src', from: '*.html' },
      { context: './src', from: '*.css' }
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      version
    })
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
    contentBase: distFolder
  }
}