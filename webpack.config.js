var debug = process.env.NODE_ENV !== "production"
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')
var path = require('path')

var htmlPlugin = new HtmlWebpackPlugin({
  template: 'index.html'
})

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/client.js",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      }, { 
        test: /\.css$/, 
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /\.(png|gif)$/,
        loader: 'file?name=[path][name].[hash].[ext]'
      }, { 
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
        loader: "file" 
      }, { 
        test: /\.(woff|woff2)$/, 
        loader:"url?prefix=font/&limit=5000" 
      }, { 
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
        loader: "url?limit=10000&mimetype=application/octet-stream" 
      }, { 
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
        loader: "url?limit=10000&mimetype=image/svg+xml" 
      }
    ]
  },
  output: {
    path: __dirname + "/dist/",
    filename: "client.min.js"
  },
  plugins: debug ? [
    new ExtractTextPlugin("site.css"),
    htmlPlugin
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: true, sourcemap: true }),
    new ExtractTextPlugin("site.css"),
    htmlPlugin
  ]
}