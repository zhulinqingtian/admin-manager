'use strict'

var request = require('request')
var rb = require('./response-builder')
var fs = require('fs')
var config = global.My

var apiServerUrl = config.proxyTable['/api']

function isJson (req) {
  var str = req.headers['Content-Type'] || req.headers['content-type'] || ''
  var contentType = str.split('')[0]
  return (contentType === 'application/json')
}

function downloadCsvScoreTemplate (req, res) {
  var ext = '.csv'
  var encodedFileName = encodeURI('积分导入模板-夏猫')
  res.setHeader("Content-type", "application/x-download")
  res.setHeader('Cache-Control', 'max-age=0') // fix ie7/8 https download error
  if (req.headers['user-agent'].toLowerCase().indexOf('firefox') === -1) {
    res.setHeader('Content-Disposition', 'attachment filename=' + encodedFileName + ext)
  } else {
    res.setHeader('Content-Disposition', 'attachment filename*="utf8\'\'' + encodedFileName + ext + '"')
  }
  var file = fs.createReadStream(__dirname + '/../download/模板' + ext)
  file.pipe(res)
}
exports.downloadCsvScoreTemplate = downloadCsvScoreTemplate

exports.proxy = function (req, res, next) {
  var method = req.method
  var options = {
    url: apiServerUrl + req.path,
    method: method,
    jar: true, // session
    headers: req.headers || {}
  }

  if (req.user) {
    options.headers.userId = req.user.id
    options.headers.taobaoId = req.user.taobaoId

    if (method === 'POST') {
      if (isJson(req)) {
        options.json = true
        options.body = req.body
      } else {
        options.form = req.body
      }
    } else {
      options.qs = req.query
    }
  } else {
    if (method === 'POST') {
      if (isJson(req)) {
        options.json = true
        options.body = req.body
      } else {
        options.form = req.body
      }
    } else {
      options.qs = req.query
    }
  }

  /**
   * ===================================================
   * 数组参数处理qsStringifyOptions：https://github.com/request/request#requestoptions-callback
   * ===================================================
   * qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'brackets' })  // 'a[]=b&a[]=c'
   */
  // options.qsStringifyOptions = {arrayFormat: 'brackets'}

  var x = request(options, function (err, response, body) {
    if (err) {
      console.log('api proxy error.', err)
      res.send(rb.internalServerError())
      return
    }
    if (response.statusCode !== 200) {
      console.log("api proxy error. code: " + response.statusCode + ", body: " + body)
      res.send(rb.internalServerError())
      return
    }
  })

  x.pipe(res)
}
