const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const env = require('./envLoader');

module.exports = {
  stats: { children: false },
  resolve: {
    alias: {
      'web-components': path.join(
        __dirname,
        '../assets/components/web-components/components'
      )
    },
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  output: {
    path: path.resolve('./bin/')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.s(a|c)ss$/,
        enforce: 'pre',
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'typings-for-css-modules-loader?silent&modules&namedExport&camelCase&modules=true&importLoaders=true&localIdentName=[name]__[local]__[hash:base64:5]&context=../server',
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.resolve(__dirname, '../assets/scss')],
                data: "@import 'vars.scss';"
              }
            }
          ]
        })
      },
      { test: /\.ts(x?)$/, loaders: ['babel-loader', 'ts-loader'] },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(jpg|ico|png|gif|eot|ttf|svg)(\?.*$|$)/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin(env())
  ]
};
