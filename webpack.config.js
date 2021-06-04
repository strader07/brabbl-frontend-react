var webpack = require("webpack");

function getEntrySources(sources) {
  if (process.env.NODE_ENV !== 'production') {
      sources.push('webpack-dev-server/client?http://localhost:8080');
      sources.push('webpack/hot/only-dev-server');
    }

  return sources;
}

module.exports = {
  entry: getEntrySources(['./src/js/init.js']),
  output: {
      publicPath: 'http://localhost:8080/',
      filename: 'dist/js/brabbl.dev.js'
    },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  ],
  devtool: 'eval',
  module: {
      preLoaders: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'source-map'
          },
          {
            test: /\.jsx?$/,
            loaders: ['eslint'],
            exclude: /node_modules/
          }
        ],
      loaders: [
          {
            test: /\.scss$/,
            include: /src/,
            loaders: [
                  'style',
                  'css',
                  'sass?outputStyle=expanded'
                ]
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
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loaders: [
                  'babel?optional=runtime'
                ]
          },
          {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff'
          },
          {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader'
          }
        ]
    },
  resolve: {
      extensions: ['', '.js', '.jsx']
    }
};
