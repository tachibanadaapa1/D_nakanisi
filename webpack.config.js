const webpack = require('webpack');

module.exports = {
  entry: {
    bundle: './app/js/main.js',
  },
  output: {
    filename: '[name].js',
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [new webpack.optimize.UglifyJsPlugin()],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
