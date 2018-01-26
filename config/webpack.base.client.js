const webpack = require('webpack');
const core = require('./webpack.core');
const extend = require('util')._extend;

// const babelOptions = {
//   "presets": [
//     "react",
//     "es2015"
//   ]
// }

module.exports = extend(core, {
  context: __dirname,
  entry: {
    main: '../client/index.tsx'
  },
  target: 'web',
  output: extend(core.output, {
    // path: path.resolve('./bin/'),
    filename: '[name].js'
  }),
  plugins: core.plugins.concat([
    new webpack.DefinePlugin({
      'ENV.BUILD_TARGET': JSON.stringify('client')
    })
    // new webpack.optimize.CommonsChunkPlugin({

    // })
  ])
});
