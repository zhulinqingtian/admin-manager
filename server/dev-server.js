// 未使用

'use strict'
// require('./check-versions')()

var config = require('../config/index')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

/* eslint: no-unused-vars:0; */

var opn = require('opn')
var path = require('path')
var express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const methodOverride = require('method-override')
const morgan = require('morgan') // 用于node.js的HTTP请求日志记录器中间件
const passport = require('passport')
var webpack = require('webpack')
var webpackConfig = (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'production')
  ? require('../build/webpack.prod.conf')
  : require('../build/webpack.dev.conf')

const routes = require('./routes-intercept') // 路由拦截

// const authPassport = require('./controllers/auth-passport')

var port = process.env.PORT || config.port

var autoOpenBrowser = !!config.autoOpenBrowser

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
// var proxyTable = config.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

// authPassport.setup(app)

// view engine setup
app.set('views', path.join(__dirname, '../')) // 视图
// html
app.engine('.html', ejs.__express)
app.set('view engine', 'html')
// app.use(favicon(path.join(__dirname, '../src/assets/img/logo.png')))
app.use(morgan('dev', {skip: (req, res) => req.method === 'HEAD'}))
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}))
app.use(cookieParser('your secret here'))
app.use(methodOverride())
app.use(passport.initialize())
app.use(passport.session())
app.use(compression())

// 通过app.use(router)就将router模块成功的挂载到了app模块上，实现了路由挂载。
// 而路由模块，则不用依赖app模块了，他真正实现了代码分离，模块之间弱耦合。
routes.setup(app) // 注册路由

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

/**
 * webpackDevMiddleware & webpackHotMiddleware
 * ===============================================
 */

/* var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

var devMiddleware = webpackDevMiddleware(compiler, {
  // 这里是对 webpackDevMiddleware 的一些配置
  // 绑定中间件的公共路径,与webpack配置的路径相同
  publicPath: webpackConfig.output.publicPath,
  quiet: true // 向控制台显示任何内容
})

var hotMiddleware = webpackHotMiddleware(compiler, {
  log: false,
  heartbeat: 2000
}) */

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})

app.use(devMiddleware)
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port
var _resolve

devMiddleware.waitUntilValid(() => {
  console.log(`admin-manager-3 server listening on ${uri} in ${app.settings.env} mode \n`)
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

console.log('> Starting dev server...')

var server = app.listen(port)

var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
