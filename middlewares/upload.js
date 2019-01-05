const multer  = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/template')
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${Date.now()}${extName}`)
  }
})

const upload = multer({ storage: storage })

module.exports = upload
