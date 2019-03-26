/**
 * 路由拆分
 */

var express = require('express')

// 创建路由
var router = express.Router()

// 添加路由，作出响应
router.get('/', function (req, res) {
  res.send('<h1>欢迎来到后台首页</h1>')
  res.end()
})

router.get('/login', function (req, res) {
  res.render('index');
})

module.exports = router
