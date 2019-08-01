'use strict'
var request = require('request')
let rb = require('./response-builder')

var config = require('../../config/index').dev

var loginServerUrl = config.proxyTable['/login']
var loginApiUrl = config.proxyTable['/loginApi']
var homePage = config.homePage
const loginUrl = `${loginServerUrl}/login?service=${encodeURIComponent(homePage + '/login?toPath=/')}`

var toLoginServerUrlData = {
  status: 'ERR_SESSION_TIMEOUT',
  message: '未登陆或登陆状态已失效！',
  data: loginUrl
}

var toLogoutServerUrlData = {
  status: 200,
  message: '您已退出登录。',
  data: loginUrl
}

var noAuthority = {
  status: '200',
  message: '您没有权限访问！'
}

exports.loginSuccess = function (req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  console.log('Login successfully, user: ' + req.user.id)
  if (req.user) {
    res.redirect(req.query.toPath || '/')
  } else {
    res.send(res)
  }
}

exports.logout = function (req, res) {
  try {
    var name = req.cookies.name
  } catch (e) {
    res.send(toLoginServerUrlData)
  }

  const option = {
    url: loginApiUrl + '/logout?token=' + name,
    method: 'GET'
  }

  request(option, function (err, response, body) {
    if (err) {
      console.log('api proxy ' + option.url + ' error: ', err)
      res.send(rb.internalServerError())
      return
    }
    if (response.statusCode !== 200) {
      console.log('api proxy ' + option.url + '  code: ' + response.statusCode + ', body: ' + body)
      res.send(rb.internalServerError())
      return
    }

    const result = JSON.parse(body)
    const code = result.code
    const message = result.message
    const data = result.response

    console.log(option.url + ' , code:' + code, ', message:', message, 'data:', data)

    if (code === 200) {
      res.send(toLogoutServerUrlData)
    } else {
      res.send(body)
    }
  })
}

exports.checkAuth = function (req, res, next) {
  let user = req.user
  if (user) {
    let timeNow = +new Date()
    res.cookie('cookieExpiresTime', timeNow + config.cookieMaxAge)
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Param', 'no-cache')
    res.setHeader('Expires', '-1')
    // locals for view templates
    res.locals.user = user
    next()
  } else {
    res.redirect('/login')
  }
}

// for request for JSON data
exports.checkAuthJSON = function (req, res, next) {
  let user = req.user
  if (user) {
    let timeNow = +new Date()
    res.cookie('cookieExpiresTime', timeNow + config.cookieMaxAge)
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Param', 'no-cache')
    res.setHeader('Expires', '-1')
    next()
  } else {
    res.redirect('/login')
  }
}

/**
 * 登陆校验
 */
exports.checkAuthTokenForView = function (req, res, next) {
  const toLoginServerUrl = `${loginServerUrl}/login?service=${encodeURIComponent(homePage +
    '/login?toPath=' + (req.path === '/login' ? '/' : req.path))}`

  try {
    var name = req.cookies.name
    var token = name.substring(name.indexOf('.') + 1, name.lastIndexOf('.'))
    var tokenStr = new Buffer(token, 'base64').toString()
    var tokenObj = JSON.parse(tokenStr)
    var userStr = tokenObj.sub
    var user = JSON.parse(userStr)
  } catch (e) {
    res.redirect(toLoginServerUrl)
  }

  // 校验token有效性
  const option = {
    url: loginApiUrl + '/tokenValidate?token=' + encodeURIComponent(name),
    method: 'GET'
  }
  request(option, function (err, response, body) {
    if (err) {
      console.log('-----checkAuthTokenForView------ api proxy ' + option.url + ' error: ', err)
      res.redirect(toLoginServerUrl)
      return
    }
    if (response.statusCode !== 200) {
      console.log('-----checkAuthTokenForView------ api proxy ' + option.url + '  code: ' + response.statusCode + ', body: ' + body)
      res.redirect(toLoginServerUrl)
      return
    }

    const result = JSON.parse(body)
    const code = result.code
    const message = result.message
    const data = result.response

    console.log('message:', message, 'data:', data)

    if (code === 200) {
      let timeNow = +new Date()
      res.cookie('cookieExpiresTime', timeNow + config.cookieMaxAge)
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Param', 'no-cache')
      res.setHeader('Expires', '-1')
      console.log('checkAuthToken user : ', user.id)

      next()
    } else {
      res.redirect(toLoginServerUrl)
    }
  })
}

exports.setAuthToken = function (req, res, next) {
  const token = req.query.token
  const toPath = req.query.toPath

  if (token) {
    res.cookie('name', token)
    res.redirect(toPath)
  } else {
    res.redirect(loginUrl)
  }
}

exports.checkAuthToken = function (req, res, next) {
  try {
    var name = req.cookies.name
    var token = name.substring(name.indexOf('.') + 1, name.lastIndexOf('.'))
    var tokenStr = new Buffer(token, 'base64').toString()
    var tokenObj = JSON.parse(tokenStr)
    var userStr = tokenObj.sub
    var user = JSON.parse(userStr)
  } catch (e) {
    res.send(toLoginServerUrlData)
  }

  // 校验token有效性
  const option = {
    url: loginApiUrl + '/tokenValidate?token=' + encodeURIComponent(name),
    method: 'GET'
  }
  request(option, function (err, response, body) {
    if (err) {
      console.log('----------- api proxy ' + option.url + ' error: ', err)
      res.send(rb.internalServerError())
      return
    }
    if (response.statusCode !== 200) {
      console.log('------------ api proxy ' + option.url + '  code: ' + response.statusCode + ', body: ' + body)
      res.send(rb.internalServerError())
      return
    }

    const result = JSON.parse(body)
    const code = result.code
    const message = result.message
    const data = result.response

    console.log('********* ', option.url + ' , code:' + code, ', message:', message, 'data:', data)

    if (code === 200) {
      let timeNow = +new Date()
      res.cookie('cookieExpiresTime', timeNow + config.cookieMaxAge)
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Param', 'no-cache')
      res.setHeader('Expires', '-1')
      console.log('checkAuthToken user : ', user.id)

      // 获取权限
      getPermissions(user.id, function (err, permissions) {
        if (err) {
          return res.send(err)
        }

        // locals for view templates
        res.locals.user = user
        req.user = user

        res.locals.user.permissions = permissions
        req.user.permissions = user.permissions

        next()
      })
    } else {
      res.send(toLoginServerUrlData)
    }
  })
}

exports.checkPermission = function (req, res, next) {
  var path = req.path
  var user = req.user
  var name = req.cookies.name

  const option = {
    url: loginApiUrl + '/permissionList?token=' + name,
    method: 'GET'
  }
  request(option, function (err, response, body) {
    if (err) {
      console.log('api proxy ' + option.url + ' error: ', err)
      res.send(rb.internalServerError())
      return
    }
    if (response.statusCode !== 200) {
      console.log('api proxy ' + option.url + '  code: ' + response.statusCode + ', body: ' + body)
      res.send(rb.internalServerError())
      return
    }

    const result = JSON.parse(body)
    const code = result.code
    const message = result.message
    const data = result.response

    console.log(option.url + ' , code:' + code, ', message:', message)

    if (code === 200) {
      for (var i = 0 i < data.length i++) {
        if (data[i].api === path) {
          if (user.permissions.indexOf(data[i].permission) > -1) {
            next()
            return
          }
        }
      }
      res.send(noAuthority)
    } else {
      res.send(noAuthority)
    }
  })
}

function getPermissions (userId, callback) {
  const option = {
    url: loginApiUrl + '/user/getPermission?userId=' + encodeURIComponent(userId),
    method: 'GET'
  }
  request(option, function (err, response, body) {
    if (err) {
      console.log('----------- api proxy ' + option.url + ' error: ', err)
      callback && callback(rb.internalServerError())
      return
    }
    if (response.statusCode !== 200) {
      console.log('------------ api proxy ' + option.url + '  code: ' + response.statusCode + ', body: ' + body)
      callback && callback(rb.internalServerError())
      return
    }

    const result = JSON.parse(body)
    const code = result.code
    const message = result.message
    const data = result.response

    console.log('********* ', option.url + ' , code:' + code, ', message:', message)
    if (code === 200) {
      callback && callback(null, data)
    } else {
      callback && callback ({
        code: code,
        message: '获取权限出错！'
      })
    }
  })
}
