const fs = require('fs')

// 在浏览器中使用模板引擎渲染列表数据
// 数据的来源
//    文章列表
//    文章分类
//  一个请求不够
//  一个模板的渲染需要请求多个接口的数据
//  $.ajax(
//    url: '接口a',
//    success: function (aData) {
//      $.ajax({
//        url: '接口b',
//        success: function (bData) {
//        }
//      })
//    }
//  )

// fs.readFile('./data/a.txt', function (err, dataA) {
//   if (err) {
//     throw err
//   }
//   console.log(dataA.toString())
//   fs.readFile('./data/b.txt', function (err, dataB) {
//     if (err) {
//       throw err
//     }
//     console.log(dataB.toString())
//     fs.readFile('./data/c.txt', function (err, dataC) {
//       if (err) {
//         throw err
//       }
//       console.log(dataC.toString())
//     })
//   })
// })
