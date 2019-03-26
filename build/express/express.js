/**
 * express的特点
 * 1、可以设置 中间件来响应http请求
 * 2、定义了路由用于执行不同的http请求动作
 * 3、可以通过模板传递参数来动态渲染html页面
 */


'use strict';
require('../check-versions')();

var config = require('../../config/index').dev;
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.env.NODE_ENV);
}

var opn = require('opn'); // 一个跨平台的node-open库，打开像网站、文件、可执行文件之类的功能
var path = require('path');
var express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
var favicon = require('serve-favicon');
const methodOverride = require('method-override');
const morgan = require('morgan'); // morgan中间件记录日志
const session = require('express-session');
const redisStore = require('connect-redis')(session);
var webpack = require('webpack');
var proxyMiddleware = require('http-proxy-middleware');
var webpackConfig = (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'production')
  ? require('../webpack.prod.conf')
  : require('../webpack.dev.conf');
const auth = require('./auth');
const routes = require('./routes');

var port = process.env.PORT || config.port; // default port where dev server listens for incoming traffic

var autoOpenBrowser = !!config.autoOpenBrowser; // automatically open browser, if not set will be false

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.proxyTable;

const redisConf = config.redis;

// serve pure static assets
var staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory);

var app = express();
var compiler = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
});

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});

app.use(require('connect-history-api-fallback')()); // handle fallback for HTML5 history API

app.use(devMiddleware); // serve webpack bundle output

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

auth.setup(app);

// view engine setup
app.set('views', path.join(__dirname, '../')); // 视图
// html
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(favicon(path.join(__dirname, '../src/assets/img/logo.png')));
app.use(morgan('dev', {skip: (req, res) => req.method === 'HEAD'}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(cookieParser('your secret here'));
app.use(methodOverride());
app.use(session({
  resave: false,
  saveUninitialized: true,
  store: new redisStore({host: redisConf.host}),
  secret: '123du',
  // cookie: {maxAge: config.cookieMaxAge}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());

routes.setup(app);

app.use(staticPath, express.static('./static'));
app.use(express.static('c:/data/uploads/shomop-member'));

var uri = 'http://localhost:' + port;

var _resolve;
var readyPromise = new Promise(resolve => {
  _resolve = resolve;
});

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
  console.log(`shomop-admin-web server listening on ${uri} in ${app.settings.env} mode \n`);
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri);
  }
  _resolve();
});

var server = app.listen(port);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close();
  }
};
