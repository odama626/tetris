const webpack = require('webpack');
const webpackBase = require('./webpack.base.client');
const extend = require('util')._extend;

module.exports = extend(webpackBase, {
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
});
