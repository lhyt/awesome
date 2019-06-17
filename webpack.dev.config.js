const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');

const HTML_PLUGINS = [
  new HtmlWebpackPlugin({
    title: '模块热替换',
    template: './src/main.html',
    chunks: 'main', // 添加引入的js,也就是entry中的key
    filename: `index.html`,
    hash: true,
  }),
];

function travelSrc(srcPath = './src') {
  const fileItems = fs.readdirSync(srcPath);
  fileItems.forEach(fileItem => {
    if (/(.*)\.html$/.test(fileItem)) {
      const page = RegExp.$1;
      HTML_PLUGINS.push(
        new HtmlWebpackPlugin({
          title: page,
          template: `${srcPath}/${page}.html`,
          chunks: page, // 添加引入的js,也就是entry中的key
          filename: `${srcPath}/${page}.html`,
          hash: true,
          headerImg: '/src/assets/images/header_1.png',
        }),
      );
      return;
    }
    const filedir = path.join(srcPath, fileItem);
    const fileStat = fs.statSync(filedir);
    // 如果是文件夹，去找html文件写到插件里面
    if (fileStat.isDirectory()) {
      travelSrc(`${srcPath}/${fileItem}`);
    }
  });
}
travelSrc();
travelSrc('./articles');

module.exports = {
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devServer: {
    contentBase: './',
    compress: true,
    port: 9000,
  },
  devtool: 'inline-source-map',
  module: {
    rules: [{
      test: /\.(png|svg|jpg|gif)$/,
      loader: 'file-loader',
    }],
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...HTML_PLUGINS,
    new webpack.HotModuleReplacementPlugin(),
  ],
  mode: 'development'
};