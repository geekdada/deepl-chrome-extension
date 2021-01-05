const env = require('./scripts/env')

const webpack = require('webpack')
const path = require('path')
const fileSystem = require('fs-extra')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const ASSET_PATH = process.env.ASSET_PATH || '/'

const alias = {
  'react-dom': '@hot-loader/react-dom',
}

// load the secrets
const secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js')

const fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
]

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath
}

const options = {
  mode: env.NODE_ENV || 'development',
  entry: {
    options: path.join(__dirname, 'src/pages/Options/index.tsx'),
    // popup: path.join(__dirname, 'src/pages/Popup/index.jsx'),
    background: path.join(__dirname, 'src/pages/Background/index.ts'),
    contentScript: path.join(__dirname, 'src/pages/Content/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    publicPath: ASSET_PATH,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: 'source-map-loader',
          },
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
    fallback: {},
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // clean the build folder
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: true,
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV', 'USE_MOCK_TRANSLATE']),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, 'build'),
          force: true,
          transform: function (content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              }),
            )
          },
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/pages/Options/index.html'),
      filename: 'options.html',
      chunks: ['options'],
      cache: false,
    }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src/pages/Popup/index.html'),
    //   filename: 'popup.html',
    //   chunks: ['popup'],
    //   cache: false,
    // }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/pages/Background/index.html'),
      filename: 'background.html',
      chunks: ['background'],
      cache: false,
    }),
  ],
  infrastructureLogging: {
    level: 'info',
  },
}

if (env.NODE_ENV === 'development') {
  options.devtool = 'eval-source-map'
} else {
  options.devtool = 'source-map'
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  }
}

module.exports = options
