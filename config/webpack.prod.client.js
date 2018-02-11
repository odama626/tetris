const webpack = require('webpack');
const webpackBase = require('./webpack.base.client');

module.exports = {
  ...webpackBase,
  ...{
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  }
};
