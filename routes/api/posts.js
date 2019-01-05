const express = require('express')
const router = express.Router()
const db = require('../../utils/db')
const upload = require('../../middlewares/upload')

// router.get('/api/posts', (req, res, next) => {
//   // 1. 操作数据库，读取文章列表数据

//   // 让该接口支持动态分页
//   // 客户端只需要提供，每页大小，当前页码
//   // /api/posts?_page=页码&_limit=每页大小
//   // 查询字符串中的数据类型都是字符串
//   let { _page = 1, _limit = 5 } = req.query
//   _page = parseInt(_page)
//   _limit = parseInt(_limit)

//   // 查询区间范围数据
//   const data = {}
//   db.pQuery('SELECT * FROM `ali_article`')
//     .then(listData => {
//       data.list = listData
//       return db.pQuery('SELECT COUNT(*) as count FROM `ali_article`')
//     })
//     .then(countData => {
//       data.count = countData[0].count
//     })
//     .then(() => {
//       res.send(data)
//     })
// })

router.get('/api/posts', (req, res, next) => {
  // 1. 操作数据库，读取文章列表数据

  // 让该接口支持动态分页
  // 客户端只需要提供，每页大小，当前页码
  // /api/posts?_page=页码&_limit=每页大小
  // 查询字符串中的数据类型都是字符串
  let { _page = 1, _limit = 5 } = req.query
  _page = parseInt(_page)
  _limit = parseInt(_limit)

  // 查询区间范围数据
  db.query(
    'SELECT * FROM `ali_article` LIMIT ?, ?',
    [
      (_page - 1) * _limit,
      _limit
    ],
    (err, listRet) => {
      if (err) {
        return next(err)
      }

      db.query('SELECT COUNT(*) as `count` FROM `ali_article`', (err, countRet) => {
        if (err) {
          return next(err)
        }
        // 2. 发送响应结果
        res.send({
          success: true,
          data: {
            list: listRet,
            count: countRet[0].count
          }
        })
      })
    })

  // 查询所有数据
  // db.query('SELECT * FROM `ali_article`', (err, ret) => {
  //   if (err) {
  //     return next(err)
  //   }

  //   // 2. 发送响应结果
  //   res.send({
  //     success: true,
  //     data: ret
  //   })
  // })
})

// const upload = multer({
//   dest: 'public/template', // 设置上传的文件保存的路径，相对于执行 node 的路径
// })

// 告诉 upload.single 它，表单数据中 article_file 是我们上传的文件
router.post('/api/posts/create', upload.single('article_file'), (req, res, next) => {
  // 1. 获取表单数据
  const { body, file } = req

  // req.body 是通过 body-parser 中间件解析出来的
  // body-parser 只能解析请求的 Content-Type 为 x-www-form-urlencoded 格式数据
  // 带有文件的表单 POST 提交的 Content-Type 为 multipart/form-data 格式数据
  // console.log(req.body)

  // 2. 保存到数据库
  db.query('INSERT INTO `ali_article` SET ?', {
    article_title: body.article_title,
    article_body: body.article_body,
    article_slug: body.article_slug,
    article_addtime: body.article_addtime,
    // article_addtime: '2018-12-30 11:20:55',
    article_status: body.article_status,
    article_cateid: body.article_cateid,
    article_adminid: req.session.user.admin_id, // 文章作者，就是当前登录的用户
    article_file: `/${file.destination}/${file.filename}` // /public/xxx
  }, (err, ret) => {
    if (err) {
      return next(err)
    }

    // 3. 发送响应结果
    res.send({
      success: true,
      data: ret
    })
  })
})

module.exports = router
