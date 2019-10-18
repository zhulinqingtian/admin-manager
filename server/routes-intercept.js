'use strict'
var fs = require('fs')
var multer = require('multer')
var express = require('express')
var rb = require('./controllers/response-builder')

var apiProxy = require('./controllers/api-proxy-controller') // api接口代理
var Download = require('./controllers/download') // 下载代理
var ImageUpload = require('./controllers/image-upload') // 上传代理
var uploadDir = multer({ dest: 'uploads/' }) // 上传路径

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
  router.post('/api/upload/uploadCrowdFile', uploadDir.single('file'), function (req, res, next) {
    req.fileParam = 'file'
    next()
  }, ImageUpload.proxy)

  // todo 上传多个
  app.post(['/api/test/gxq/upload_imgs'], uploadDir.single('file'), ImageUpload.proxy)
  app.post(['/gxq/upload_imgs'], uploadDir.single('file'), ImageUpload.proxy)

  // 导出文件
  router.get('/api/oss/downloadIMG', Download.proxy)
  router.get('/api/download/downloadCsvScoreTemplate', Download.downloadCsvScoreTemplate) // 下载导入积分模板

  /**
   * 多文件上传
   */
  router.post('/api/test/gxq/upload_imgs', function (req, res, next) {
    console.log('多文件上传')
    next()
  }, uploadDir.array('file', 10), ImageUpload.proxy)

  router.post('/uploadMore', uploadDir.array('file', 10), function (req, res, next) { // 这里10表示最大支持的文件上传数目
    let files = req.files
    if (files.length === 0) {
      res.render('error', {message: '上传文件不能为空！'})
      return false
    } else {
      let fileInfos = []
      for (var i in files) {
        let file = files[i]
        let fileInfo = {}

        fs.renameSync('./upload/' + file.filename, './upload/' + file.originalname) // 这里修改文件名。

        // 获取文件基本信息
        fileInfo.mimetype = file.mimetype
        fileInfo.originalname = file.originalname
        fileInfo.size = file.size
        fileInfo.path = file.path

        fileInfos.push(fileInfo)
      }
      // 设置响应类型及编码
      res.set({
        'content-type': 'application/json; charset=utf-8'
      })
      res.end('success!')
    }
  })

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
