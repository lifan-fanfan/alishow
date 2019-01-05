// const fs = require('fs')

// fs.readdir('./routes/', (err, files) => {
//   if (err) {
//     throw err
//   }
//   console.log(files)
// })


var glob = require("glob")

// ./routes/*.js 只查找一级
// ./routes/**/*.js 递归查找所有的子目录
// glob("./routes/**/*.js", function (err, files) {
//   if (err) {
//     throw err
//   }
//   console.log(files)
// })

const files = glob.sync("./routes/**/*.js")
console.log(files)
