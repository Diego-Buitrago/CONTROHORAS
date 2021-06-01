const path = require('path');

module.exports = {

  entry: {
    app: ['./index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/build/'
  },
  resolve: {
    extensions: ['', '.js']
  },
  devServer: {
    host: '0.0.0.0',
    port: '8080',
    inline: true
  },
  module: {
    loaders: [
        {  
            test: /(\.js|.jsx)$/,
            loader: 'babel',
            exclude: '/node_modules/',
            query: {
                presets: ['es2015']
            }
         }
    ]
  }
}