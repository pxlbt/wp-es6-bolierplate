// Example webpack configuration with asset fingerprinting in production.
'use strict';

var path = require('path');
var webpack = require('webpack');

// must match config.webpack.dev_server.port
var devServerPort = 3810;
// set TARGET=production on the environment to add asset fingerprints
var production = process.env.TARGET === 'production';

var config = {
  entry: [
    'webpack-dev-server/client?http://localhost:'+devServerPort,
    'webpack/hot/only-dev-server',
    './assets/javascripts/app'
  ],

  output: {
    // Build assets directly in to public/webpack/, let webpack know
    // that all webpacked assets start with webpack/

    // must match config.webpack.output_dir
    path: path.join(__dirname, 'dist'),
    filename: production ? '[name]-[chunkhash].js' : 'app.js'
  },

  module: {
    loaders: [
      { test: /.js$/, loader: 'babel-loader', exclude: /(node_modules|bower_components)/ }
    ]
  },

  resolve: {
    root: path.join(__dirname, 'assets', 'javascripts'),
    extensions: ['', '.js', '.coffee', '.js.coffee', '.jsx.coffee','.js.jsx.coffee'],
    modulesDirectories: ["node_modules", "javascripts"]
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "React": 'react',
      "_": 'underscore'
    })
  ]
};

if (production) {
  config.plugins.push(
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: { warnings: false },
      sourceMap: false
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  );
} else {
  config.devServer = {
    port: devServerPort,
    headers: { 'Access-Control-Allow-Origin': "*" }
  };
  config.output.publicPath = '//localhost:' + devServerPort + '/dist';
  // Source maps
  config.devtool = 'cheap-module-eval-source-map';
}

module.exports = config;
