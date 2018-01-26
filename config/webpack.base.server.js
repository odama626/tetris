const webpack = require('webpack');
const StartServerPlugin = require('start-server-webpack-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const core = require('./webpack.core');
const extend = require('util')._extend;

module.exports = extend(core, {
  entry: ['./server/index.js'],
  target: 'node',

  externals: [nodeExternals()],
  plugins: core.plugins.concat([
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'ENV.BUILD_TARGET': JSON.stringify('server')
    })
  ]),
  output: extend(core.output, { filename: 'server.js' })
});
