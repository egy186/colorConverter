'use strict';

const path = require('path');
const webpack = require('webpack');

const dest = path.join(__dirname, 'dist');
const src = path.join(__dirname, 'src/js');

module.exports = {
  entry: { app: [path.join(src, 'app.js')] },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.js/
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: dest
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ]),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
