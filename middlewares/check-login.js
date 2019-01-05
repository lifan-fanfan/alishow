module.exports = function (options) {
  // options = { app: app }
  // options.app
  // optiopns.a
  return (req, res, next) => {
    const url = req.originalUrl

    // 1. 如果当前请求路径是 /admin/login ，则说明都不处理，允许通过
    if (url === '/admin/login') {
      // 调用 next 会往后找与当前请求匹配的路由处理函数
      // 例如，当前请求是 /admin/login ，那么这里的 next 会找到后面的一个路径是 /admin/login 的路由去处理
      return next()
    }

    // 2. 如果是非 /admin/login 请求路径，则校验登录状态
    const sessionUser = req.session.user

    // 2.1 如果没有登录，则让用户跳转到登录页
    if (!sessionUser) {
      return res.redirect('/admin/login')
    }

    // 2.2 代码执行到这里，就意味着用户登录了，放行通过
    //    next 会自动往后匹配调用与当前请求匹配的路由
    //    例如当前请求是 GET /admin/users ，则 next 会调用我们后面挂载的那个处理 GET 请求，路径是 /admin/users 的路由
    //      GET /admin/categories 则会往后调用我们那个 处理 /admin/categories 的路由

    // 当所有的响应页面都需要使用相同的模板数据的时候
    // 我们可以把这种公用的数据放到 app.locals 对象
    // app.locals 对象中的数据可以在 res.render 渲染的任何页面中直接使用
    options.app.locals.sessionUser = sessionUser

    next()
  }
}
