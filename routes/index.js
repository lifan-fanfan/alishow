/**
 * 提供门户端视图路由
 */

const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('index.html')
})

router.get('/list', (req, res, next) => {
  res.render('list.html')
})

router.get('/detail', (req, res, next) => {
  res.render('detail.html')
})

module.exports = router
