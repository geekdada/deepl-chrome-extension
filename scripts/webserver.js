process.env.ASSET_PATH = '/'

const WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('../webpack.config'),
  env = require('./env'),
  path = require('path')

const options = {
  notHotReload: ['contentScript'],
}
const excludeEntriesToHotReload = options.notHotReload || []

for (const entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      'webpack-dev-server/client?http://localhost:' + env.PORT,
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName])
  }
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || [],
)

const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
  https: false,
  hot: true,
  injectClient: false,
  writeToDisk: true,
  port: env.PORT,
  contentBase: path.join(__dirname, '../build'),
  publicPath: `http://localhost:${env.PORT}`,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  disableHostCheck: true,
})

server.listen(env.PORT)
