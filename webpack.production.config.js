const webpack = require("webpack");

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
      app: './src/js/init.js'
    },
  output: {
      path: `dist/build/${process.env.APP_ENV}/`,
      publicPath: 'https://api.brabbl.com/embed/',
      filename: 'brabbl.js'
    },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'APP_ENV': JSON.stringify(process.env.APP_ENV)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    new webpack.NoErrorsPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en-gb|de)$/)
  ],
  module: {
      loaders: [
          {
            test: /\.scss$/,
            include: /src/,
            exclude: /src\/css\/themes\/.+\.scss$/,
            loaders: [
              'style',
              'css',
              'sass?outputStyle=expanded'
            ]
          },
          {
            test: /src\/css\/themes\/.+\.scss$/,
            loader: "file-loader?name=./themes/[name].css!sass"
          },
          {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
          },
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
              'url?limit=8192',
              'img'
            ]
          },
          {
            test: /\.json$/,
            loaders: [
              'json'
            ]
          },
          {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff'
          },
          {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader'
          },
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loaders: [
              'babel?stage=0'
            ]
          }
        ]
    },
  resolve: {
      modulesDirectories: [
        'js',
        'node_modules'
      ],
      extensions: ['', '.js', '.jsx']
    }
};
