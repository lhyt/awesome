const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname),
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/main.html',
      chunks: 'main', // 添加引入的js,也就是entry中的key
      filename: `index.html`,
      hash: true,
    }),
  ],
  mode: 'production'
};