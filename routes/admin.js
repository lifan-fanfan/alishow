/**
 * 提供后台管理系统相关视图渲染路由
 */
const express = require('express')
const router = express.Router()
const db = require('../utils/db')

router.get('/admin', (req, res, next) => {
  // // 如果用户没有登录，则该页面不允许进来，让用户跳转到登录页面
  // const sessionUser = req.session.user

  // if (!sessionUser) {
  //   // res.redirect() 方法的作用就是服务端重定向
  //   // 该方法会发送一个 302 状态码，在响应头中写入一个字段 Location，值是 /admin/login
  //   // 客户端收到响应之后，看到是 302 状态码，然后客户端会找到响应头中的 Location，然后对该路径重新发起请求
  //   return res.redirect('/admin/login')
  // }

  // admin/index.html 继承了模板页，模板页中引用了 aside.html 侧边栏
  // 所以这里传入的数据对象，在模板页或者 aside.html 中都可以使用
  res.render('admin/index.html')
})

router.get('/admin/login', (req, res, next) => {
  res.render('admin/login.html')
})

router.get('/admin/posts', (req, res, next) => {
  res.render('admin/posts.html')
})

router.get('/admin/categories', (req, res, next) => {
  res.render('admin/categories.html')
})

router.get('/admin/users', (req, res, next) => {
  res.render('admin/users.html')
})

router.get('/admin/posts/new', (req, res, next) => {
  db.query('SELECT * from `ali_cate`', (err, ret) => {
    if (err) {
      return next(err)
    }
    res.render('admin/posts-new.html', {
      categories: ret
    })
  })
})

module.exports = router
