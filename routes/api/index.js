const express = require('express')
const router = express.Router()
const upload = require('../../middlewares/upload')

router.post('/api/upload', upload.single('file'), (req, res, next) => {
  const file = req.file
  res.send({
    success: true,
    data: `/${file.destination}/${file.filename}`
  })
})

module.exports = router
