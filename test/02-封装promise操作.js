const fs = require('fs')

const promiseReadFile = function (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const pSetTimeout = function (time) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve()
    }, time)
  })
}

// pSetTimeout(1000).then(function () {
//   console.log('时间到了')
// })


// 等 1 秒，再读 a
// 读完 a，等 2秒，再读 b

pSetTimeout(1000)
  .then(() => {
    return promiseReadFile('./data/a.txt')
  })
  .then((data) => {
    console.log(data)
    return pSetTimeout(2000)
  })
  .then(() => {
    return promiseReadFile('./data/b.txt')
  })
  .then(data => {
    console.log(data)
    return pSetTimeout(3000)
  })
  .then(() => {
    return promiseReadFile('./data/c.txt')
  })
  .then(data => {
    console.log(data)
    console.log('Game Over...')
  })

// promiseReadFile('./data/a.txt')
//   .then(function (data) {
//     console.log(data)
//     // 这里 return 的是 promiseReadFile 的返回值
//     // promiseReadFile 的返回值是一个 Promise 对象
//     return promiseReadFile('./data/b.txt')
//   })
//   .then(data => {
//     console.log(data)
//     return promiseReadFile('./data/c.txt')
//   })
//   .then(data => {
//     console.log(data)
//   })
