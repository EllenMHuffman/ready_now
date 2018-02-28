const webpack = require('webpack');


module.exports = {
  entry: [
    "./static/js/readyNow.jsx"
  ],
  output: {
    path: __dirname + '/static',
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
  ]
};
