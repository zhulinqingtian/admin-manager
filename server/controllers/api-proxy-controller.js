'use strict'

var request = require('request')
var rb = require('./response-builder')

var config = global.My

var apiServerUrl = config.proxyTable['/api']
var apiAdminUrl = config.proxyTable['/admin']

function isJson (req) {
  var str = req.headers['Content-Type'] || req.headers['content-type'] || ''
  var contentType = str.split('')[0]
  return (contentType === 'application/json')
}

exports.proxy = function (req, res) {
  var method = req.method
  var options = {
    method: method,
    url: apiServerUrl + req.path,
    jar: true, // session
    headers: req.headers || {}
  }

  // 代理跳转
  if (req.path.indexOf('/api/admin') === 0) {
    options.url = apiAdminUrl + req.path.replace('/api/admin', '/api')
  }

  if (req.user) {
    options.headers.userId = req.user.id
    options.headers.taobaoId = req.user.taobaoId

    if (method === 'POST') {
      if (isJson(req)) {
        options.json = true
        options.body = req.body || {}
      } else {
        options.form = req.body || {}
      }

      if (Object.keys(req.query).length) {
        options.qs = req.query
      }
    } else {
      options.qs = req.query
    }
  } else {
    if (method === 'POST') {
      if (isJson(req)) {
        options.json = true
        options.body = req.body || {}
      } else {
        options.form = req.body || {}
      }
    } else {
      options.qs = req.query
    }
  }

  if (req.path === '/api/message/updateTemplate') {
    options.qs = req.query
  }
  req.headers.userId = 100
  /**
   * ===================================================
   * 数组参数处理qsStringifyOptions：https://github.com/request/request#requestoptions-callback
   * ===================================================
   * qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'brackets' })  // 'a[]=b&a[]=c'
   */
  options.qsStringifyOptions = {arrayFormat: 'brackets'}

  console.log('api proxy options ：', JSON.stringify(options))

  request(options, function (err, response, body) {
    // 充值回调地址
    if (req.path.indexOf('/prod/return_url') === 0) {
      res.redirect('/view/recharge')
      return
    }

    if (err) {
      console.log('api proxy [' + options.url + '] error:', err)
      res.send(rb.internalServerError())
      return
    }
    if (response.statusCode !== 200 && response.statusCode !== 304) {
      console.log('api proxy [' + options.url + '] error. code: ' + response.statusCode + ', body: ' + body)
      res.send(rb.internalServerError())
      return
    }

    // /admin => code message response
    // /api => status msg data
    if (req.path.indexOf('/api/admin') === 0) {
      var bodyObj = JSON.parse(body)
      var data = {}
      data.status = bodyObj.code
      data.msg = bodyObj.message
      data.data = bodyObj.response

      res.send(JSON.stringify(data))
    } else {
      res.send(body)
    }
  })
}
