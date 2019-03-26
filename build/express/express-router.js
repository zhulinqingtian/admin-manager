/**
 * express路由可以配置多个入口,管理多个模块路由
 *
 * vue-router: 单页面的跳转
 */

/**
 * express中间件
 * ==================
 * 在express中，中间件的实质就是函数，它们有一定的作用（如：增、删、改、查），起到过滤请求和响应的作用。
 *
 * >中间件：Middleware，本质为一个函数，它可以访问请求对象request(res),响应对象response（res），以及在web应用上处于请求-响应循环中的中间件。
 *
 * 中间件的功能：
 * ==================
 * 1、执行任何代码
 * 2、修改请求和响应对象
 * 3、终结请求-响应循环
 * 4、调用堆栈中的下一个中间件
 *
 * 【注意】：如果当前中间件没有结束请求-响应循环，则必须调用next（）方法将控制权交给下一个中间伯，否则请求就会挂起。
 *
 *
 * 内置的唯一的中间件：
 * static是express
 *
 * 第三方中间件：
 * 如：body-parser
 */

var http = require('http')
var express = require('express')
var bodyparser = require('body-parser')
const ejs = require('ejs')

var app = express()

app.engine('.html', ejs.__express) // 定义一个模板引擎

app.set('views engine', 'html') // 设置对应模板引擎

app.set('views', path.join(__dirname, 'views')) // 视图 设置引擎的模板初始路径 //作用：设置html模板的路径为views，下面代码在使用引擎返回页面时，只需写相对views的路径即可

app.get('/', function(req, res){ // get方式提交时，渲染页面
  res.render('index.html') // 使用res.render方式发送页面
  // 在这里不需要再写html相对当前文件的路径，而是直接通过views目录来找到index.html文件
})

var admin = require('./admin-router') // 引入admin模块

// 使用bodyparser中间件，解析post方式提交的请求数据
app.use(bodyparser.urlencoded({extended:false}))

// 在index内的form表单里提交时，在后台打印req.body的值
app.post('/login', function(req, res){
  console.log(req.body) // {username:'admin',pwd:'12345'}
})

// 使用admin模块
app.use('/admin', admin) // 这里的路径'/admin'，使用admin模块，这个行为就是把admin模块挂载到/admin路径下，通过/admin就可以访问admin的主页，

// 创建服务并监听
http.createServer(app).listen(8101,function(){
  console.log('listening....')
})
