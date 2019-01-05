const express = require('express')
const router = express.Router()
const db = require('./utils/db')
const moment = require('moment')

router.get('/api/categories', (req, res, next) => {
  // 1. 操作数据库获取数据
  // 2. 把数据响应给客户端
  db.query('SELECT * FROM `ali_cate`', function (err, data) {
    if (err) {
      throw err
    }
    res.send({
      success: true,
      data
    })
  })
})

router.get('/api/categories/delete', (req, res, next) => {
  // 获取要删除的数据id
  const { id } = req.query

  // 操作数据库，执行删除
  db.query('DELETE FROM `ali_cate` WHERE `cate_id`=?', [id], (err, ret) => {
    if (err) {
      throw err
    }
    res.send({
      success: true,
      ret
    })
  })
})

router.post('/api/categories/create', (req, res, next) => {
  // 1. 获取表单数据
  const body = req.body
  // 2. 验证数据的有效性（永远不要相信客户端的输入）

  body.cate_createdAt = moment().format('YYYY-MM-DD HH:mm:ss')

  // 3. 操作数据库，执行插入操作
  //    { cate_name: 'xxx', cate_slug: 'xxx' }
  //    query 方法会把对象转为 filed1==value1&filed2=value2... 格式，替换到 sql 语句中的 ?
  db.query('INSERT INTO `ali_cate` SET ?', body, (err, ret) => {
    if (err) {
      throw err
    }

    // 4. 发送响应给客户端
    res.send({
      success: true,
      data: ret
    })
  })
})

router.get('/api/categories/query', (req, res, next) => {
  // 1. 获取查询字符串中的 id
  const { id } = req.query

  // 2. 执行数据库查询操作
  db.query('SELECT * FROM `ali_cate` WHERE `cate_id`=?', [id], (err, ret) => {
    if (err) {
      throw err
    }

    // 3. 发送响应
    res.send({
      success: true,
      data: ret[0]
    })
  })
})

router.post('/api/categories/update', (req, res, next) => {
  // 1. 获取表单提交数据
  const body = req.body

  // 2. 操作数据库，执行编辑
  db.query(
    'UPDATE `ali_cate` SET `cate_name`=?, `cate_slug`=? WHERE `cate_id`=?',
    [body.cate_name, body.cate_slug, body.cate_id],
    (err, ret) => {
      if (err) {
        throw err
      }
      
      // 3. 发送响应
      res.send({
        success: true,
        data: ret
      })
    }
  )
})

module.exports = router
