/**
 * express中间件处理request 和 response
 */
var request = require('request');
var multer  = require('multer');
var rb = require('./controllers/response-builder');
var apiProxy = require('./controllers/api-proxy-controller');
var apiServerUrl = global.MANAGE_CONF.proxyTable['/api'];
var fs = require('fs');
var path = require('path');

var upload = multer({ dest: 'uploads/' }); // 设置上传的地址

exports.setup = function setup(app) {
  /**
   * view
   */
  app.get('/', function (req, res) {
    res.render('index');
  });
  app.get('/view', function (req, res) {
    res.render('index');
  });
  app.get('/view/*', function (req, res) {
    res.render('index');
  });


  /**
   * API
   */
  // 上传
  app.post('/api/upload/uploadImage', upload.single('file'), function (req, res, next) {
    next();
  }, function (req, res) {
    var method = req.method;
    var options = {
      url: apiServerUrl + req.path,
      method: method,
      formData:{
        file: {
          value: fs.createReadStream(path.resolve(__dirname, '../' + req.file.path)),
          options: {
            filename: req.file.originalname,
            contentType: req.file.mimetype
          },
          accept:'image/jpg,image/jpeg,image/png,image/gif,image/bmp'
        }
      }
    };

    request(options, function (err, response, body) {
      if (err) {
        console.log('upload api proxy error.', err);
        res.send(rb.internalServerError());
        return;
      }
      if (response.statusCode !== 200) {
        console.log("upload api proxy error. code: " + response.statusCode + ", body: " + body);
        res.send(rb.internalServerError());
        return;
      }
      res.send(body);
    });
  });

  app.get('/api/admin/*', function (req, res, next) {
    // 特殊接口传参：从服务端获取值，赋给req.body(服务端 -> 前端)
    req.body.user = req.user.id;

    // 如果当前中间件没有结束请求-响应循环，则必须调用next（）方法将控制权交给下一个中间伯，否则请求就会挂起。
    next();
  });

  app.get('/api/*', apiProxy.proxy);
}
