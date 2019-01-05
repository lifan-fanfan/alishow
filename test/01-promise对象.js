// Promise 是 es6 新增的一个构造函数
// 使用它的第一个就是 new 出 Promise 实例
// Promise 接受一个函数作为参数
// 该函数接受两个参数
//    reoslve 成功，通过
//    reject  失败，驳回
// 我们要做的就是把异步操作放到 Promise 容器中
// 遵循规则：
//    当容器中异步操作成功的时候，调用 resolve
//    当容器中异步操作失败的时候，调用 reject

const fs = require('fs')

// 1. 封装异步操作
var p1 = new Promise(function (resolve, reject) {
  fs.readFile('./data/a.txt', 'utf8', (err, data) => {
    if (err) {
      // 失败，调用 reject，传递错误对象
      // 这里调用 reject 就相当于调用了 then 的第二个参数函数
      reject(err)
    } else {
      // 成功，调用 resolve，如果有数据，就传给 resolve
      // 这里调用 resolve 就相当于调用了 then 的第一个参数函数
      resolve(data)
    }
  })
})

// 2. 获取 Promise 容器中异步任务的执行结果
//    结果：成功，失败
// p1.then(function (data) {
//   console.log('then 的第一个参数函数 =>', data)
// }, function (err) {
//   console.log('then 的第二个参数函数 =>', err)
// })

// 还可以在 then 之后通过 .catch 捕捉错误
// p1.then(function (data) {
//   console.log(data)
// }).catch(function (err) {
//   console.log('catch => ', err)
// })


// then 之后可以继续的链式的 then
p1
  .then(function (data) {
    // 除了第一个 then 中的结果是 Promise 容器中异步操作的 resolve 结果
    console.log(data)

    // return 普通的数据成员并没有意义
    // 只有 return 一个 Promise 对象才有意义
    // return 123
    return new Promise((resolve, reject) => {
      // resolve 的调用放到异步操作之后
      // resolve()
      fs.readFile('./data/b.txt', 'utf8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  })
  .then(function (data) {
    // 后续所有的 then 的结果都是上一个 then 返回的结果
    console.log(data)
    return new Promise((resolve, reject) => {
      fs.readFile('./data/c.txt', 'utf8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  })
  .then(data => {
    console.log(data)
  })





