const express = require('express')
const path = require('path')
const router = require('./router')
const glob = require('glob')
const session = require('express-session')
const checkLogin = require('./middlewares/check-login')

/**
 * 配置 Session 数据持久化
 * 参考文档：https://github.com/chill117/express-mysql-session
 * 1. npm install express-mysql-session
 * 2. 下面的
 */
const MySQLStore = require('express-mysql-session')(session)

const sessionStore = new MySQLStore({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'alishow62'
})

const app = express()

/**
 * 配置 Session
 * 参考文档：https://github.com/expressjs/session
 * 配置好之后，这个插件会给 req 对象添加一个成员 session
 * 往 Session 中写入数据：req.session.xxx = xxx
 * 读取 Session 数据：req.session.xxx
 * 默认情况下，服务端 Session 数据是保存在内存中的，一旦服务器重启，Session 数据就会丢失
 */
app.use(session({
  secret: 'itcast', // 服务端加密小票信息有一个算法，这里用来设置一个加密的私钥，可以提高加密数据的安全性
  resave: false,
  store: sessionStore, // 告诉 express-session 这个插件，使用 sessionStore 来持久化 Session 数据
  saveUninitialized: true, // 如果为 true，无论你是否存储 Session 数据，都给客户端发一个小票，如果为 false，只有在第一次存储 Session 数据的时候，才会下发小票
  // 这里配置的 Cookie 过期，并不适合实现记住我的功能
  // 因为每一次往 Session 中写数据的时候都会动态的更新过期时间
  // Session 中不仅仅存储用户登录的状态数据，在会话期间还会有别的数据
  cookie: { // 配置自动生成的 Cookie 小票
    // Cookie 的过期与否取决于客户端浏览器
    // 浏览器每次发送 Cookie 的时候，会看一下过期时间，如果过期了，就不发了，没有过期才发过来
    // expires: 日期对象  // 过期时间，绝对的过期时间，xx年xx月xx日 xx时xx分xx秒
    // maxAge: 基于当前时间+7天 2018-12-30 09:17:45
    // maxAge: 1000 * 60 // 滑动过期时间，给一个毫秒数，相对于当前时间往后增加
  }
}))

// 第一个参数用来指定模板文件的后缀名
// 环境变量就是一些特殊的字符串，某些软件会根据环境变量执行不同的行为
//    例如 Windows 操作系统的 PATH 环境变量
//    或者我们在执行 Node 程序的时候，临时添加的环境变量
app.engine('html', require('express-art-template'))
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
})

// 没有第一个参数，则访问 public 中的资源，直接访问
// 有第一个参数，则访问 public 中的资源，必须以前缀开头
// 如果没有前缀，同时这个目录中有一个 index.html 文件，则访问 / 的时候，优先渲染 public/index.html 文件
app.use('/public', express.static(path.join(__dirname, './public')))

/**
 * 配置解析表单 POST 请求体
 * 配置好以后，我们就可以在请求处理函数中通过 req.body 获取请求体数据
 * express 已经内置 body-parser
 * express 通过 express.urlencoded 方法包装了 body-parser
 */
app.use(express.urlencoded())

// 把独立的路由系统整合到 Express 应用中
// app.use(router)

// 加载 routes 目录中所有的路由模块
// 最笨的方法就是一个一个来

/**
 * 统一校验管理系统的页面访问权限
 * 这里就相当于是所有进入 /admin/xxx 之前的一道关卡
 * 说白了就是校验所有以 /admin 开头的这些页面请求路径，不包含 /admin/login
 */
app.use('/admin', checkLogin({
  app: app
}))


// checkLogin() 返回一个函数(req, res, next) 作为 app.use 的第二个参数

/**
 * 自动挂载路由模块
 *   获取 routes 目录中所有的 js 路由模块文件路径
 *   循环加载
 */
const files = glob.sync(path.join(__dirname, './routes/**/*.js'))
files.forEach((routerPath => {
  app.use(require(routerPath))
}))

// 四个参数，缺一不可
// 这里配置好以后，接下来你就可以在其他的路由处理函数中，遇到错误的使用，调用 next(传入错误对象)
// 那么，这个带有四个参数的中间件就会被调用
// 该中间件的第一个参数就是你 next(错误对象) 调用所传递的那个错误对象
app.use((err, req, res, next) => {
  // 简单一点，在网站系统中增加一个异常管理功能
  //    数据表，异常表
  //    报错时间，报错文件，具体的报错信息，哪个路由，哪个方法....
  //    发送邮件或短信给开发人员，给管理员
  res.status(500).send({
    statusCode: 500,
    message: 'Internal Server Error',
    error: err.message
  })
})

app.listen(3000, () => {
  console.log('Server running http://127.0.0.1:3000/')
})
