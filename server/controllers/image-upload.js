
var request = require('request')
var fs = require('fs')
var path = require('path')
var rb = require('./response-builder')
var apiServerUrl = global.My.proxyTable['/api/test']

exports.proxy = function (req, res) {
  var method = req.method
  var serverURL = apiServerUrl

  if (req.path.indexOf('/api/test') > -1) {
    serverURL = serverURL.replace('/api/test', '')
  }

  var options = {
    url: serverURL + req.path,
    method: method,
    formData: {
      file: {
        value: fs.createReadStream(path.resolve(__dirname, '../../' + req.file.path)),
        options: {
          filename: req.file.originalname,
          contentType: req.file.mimetype
        },
        accept: 'image/jpg,image/jpeg,image/png,image/gif,image/bmp'
      }
    }
  }

  console.log(`----- ${req.path} options:', ${options}`)

  request(options, function (err, response, body) {
    if (err) {
      console.log('api proxy error.', err)
      res.send(rb.internalServerError())
      return
    }
    if (response.statusCode !== 200 && response.status !== 'OK' && response.status !== 'true') {
      console.log("api proxy error. code: " + response.statusCode + ", body: " + body)
      res.send(rb.internalServerError())
      return
    }
    res.send(body)
  })
}
