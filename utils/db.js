const mysql = require('mysql')

/**
 * 使用连接池连接操作数据库
 * @type {[type]}
 */
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'alishow62'
})

// pool.query 是自带的操作方法，不支持 Promise

// 函数参数中 ...args 会把接收到的所有参数放到一个数组中
// 页就是说 args 是一个数组,[参数1, 参数2]
// PQuery(1, 2) [1, 2]
pool.pQuery = function (...args) {
  return new Promise((resolve, reject) => {
    // var arr = [1, 2]
    // fn(...arr) 等价于 fn(arr[0], arr[1])
    pool.query(...args, function (err, ret) {
      if (err) {
        reject(err)
      } else {
        resolve(ret)
      }
    })
  })
}

// pQuery('sql语句', 可选参数)
//   .then(data => {
//     console.log(data)
//     return pQuery('sql 语句')
//   })
//   .then(data => {
//     return pQuery('sql 语句')
//   })
//   .then()

module.exports = pool

// pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });


// const mysql = require('mysql');

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '123456',
//   database: 'alishow62'
// })

// connection.query('SELECT * FROM `ali_cate`', function (err, data) {
//   if (err) {
//     throw err
//   }
//   console.log(data)
// })

// 导出连接对象
// 连接对象中有 query 方法
// 注意：必须导出 connection，否则会报错
// module.exports = connection
