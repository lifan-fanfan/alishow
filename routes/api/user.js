const express = require('express')
const router = express.Router()
const db = require('../../utils/db')
const md5 = require('../../utils/md5')

router.get('/api/users', (req, res, next) => {
  db.query('SELECT * FROM `ali_admin`', (err, ret) => {
    if (err) {
      return next(err)
    }
    res.send({
      success: true,
      data: ret
    })
  })
})

router.post('/api/users/create', (req, res, next) => {
  // 1. 获取表单数据
  const body = req.body

  // 2. 表单数据校验
  //     2.1 普通数据验证
  //     2.2 业务数据验证
  
  // 2.2.1 邮箱验证
  db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?', [body.admin_email], (err, ret) => {
    if (err) {
      return next(err)
    }
    // [][0] undefined false
    // [用户信息对象][0] 用户对象 true
    if (ret[0]) {
      return res.send({
        success: false,
        message: '邮箱已被占用'
      })
    }

    // 2.2.1 别名验证
    db.query('SELECT * FROM `ali_admin` WHERE `admin_slug`=?', [body.admin_slug], (err, ret) => {
      if (err) {
        return next(err)
      }
      if (ret[0]) {
        return res.send({
          success: false,
          message: '别名已被占用'
        })
      }

      // 2.2.3 昵称重复验证
      db.query('SELECT * FROM `ali_admin` WHERE `admin_nickname`=?', [body.admin_nickname], (err, ret) => {
        if (err) {
          return next(err)
        }
        if (ret[0]) {
          return res.send({
            success: false,
            message: '昵称已被占用'
          })
        }

        // 代码执行到这里，意味着邮箱、别名、昵称都没有被占用，可以使用
        
        // 3. 执行数据库插入操作
        db.query('INSERT INTO `ali_admin` SET ?', {
          admin_email: body.admin_email,
          admin_slug: body.admin_slug,
          admin_nickname: body.admin_nickname,
          admin_pwd: md5(md5(body.admin_pwd))
        }, (err, ret) => {
          if (err) {
            return next(err)
          }

          // 4. 发送响应
          res.send({
            success: true,
            data: ret
          })
        })
      })
    })
  })
})

router.get('/api/users/check/email', (req, res, next) => {
  // admin_email
  const { admin_email } = req.query
  db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?', [admin_email], (err, ret) => {
    if (err) {
      return next(err)
    }
    if (ret[0]) {
      res.send(false)
    } else {
      res.send(true)
    }
  })
})

router.get('/api/users/check/slug', (req, res, next) => {
  // admin_slug
})

router.get('/api/users/check/nickname', (req, res, next) => {
  // admin_nickname
})

router.post('/api/users/login', (req, res, next) => {
  // 1. 获取表单数据
  const body = req.body

  // 2. 数据验证
  // 2.1 基本数据校验

  // 2.2 业务数据校验
  // 2.2.1 用户是否存在
  db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?', [body.admin_email], (err, ret) => {
    if (err) {
      return next(err)
    }
    
    const user = ret[0]
    
    if (!user) {
      return res.send({
        success: false,
        message: '用户不存在'
      })
    }

    // 2.2.2 密码是否正确
    if (md5(md5(body.admin_pwd)) !== user.admin_pwd) {
      return res.send({
        success: false,
        message: '密码错误'
      })
    }

    // 代码执行到这里，意味着登录成功了
    // 所以我们就可以在这里使用 Session 记录用户的登录状态了
    // 这里我们往 Session 中存储了一个数据名叫 user，值是 当前登录用户的信息
    req.session.user = user

    // 3. 用户存在，密码正确，发送登录成功响应
    res.send({
      success: true
    })
  })
})

module.exports = router
