'use strict'
var multer = require('multer')
var express = require('express')
var rb = require('./controllers/response-builder')

var apiProxy = require('./controllers/api-proxy-controller') // api接口代理
var Download = require('./controllers/download') // 下载代理
var Upload = require('./controllers/image-upload') // 上传代理
var upload = multer({ dest: 'uploads/' }) // 上传路径

var router = express.Router()

exports.setup = function setup (app) {
  router.get('/', function (req, res, next) {
    res.redirect('/') // /demos
  })

  // /base/abc
  router.get('base/:username', function (req, res, next) {
    res.send('username: ' + req.params.username)
  })

  /**
   * API
   */

  router.get('/getUser', function (req, res) {
    res.send(rb.data(req.user))
  })

  // 上传
  router.post('/api/upload/uploadCrowdFile', upload.single('file'), function (req, res, next) {
    req.fileParam = 'file'
    next()
  }, Upload.proxy)

  // 上传积分文件
  router.post('', upload.single('file'), Upload.proxy)

  // 导出文件
  router.get('/api/oss/downloadIMG', Download.proxy)
  router.get('/api/download/downloadCsvScoreTemplate', Download.downloadCsvScoreTemplate) // 下载导入积分模板

  // API
  router.all('/api/user/getById', function (req, res, next) {
    req.query.id = req.user.id
    next()
  })

  router.all('/api/*', apiProxy.proxy)
}

/*
 *
 * 需要多个路由文件时的写法（分模块的路由）
 * router.user('/admin', require('./routers/admin')) // 引入路由文件
 *
 * // admin.js
 * const express = reqire('express')
 * const router = express.Router()
 * router.get('/user', function(req, res, next) {
 *     ...
 * })
 * module.exports = router
 */
