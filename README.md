# 第13章 综合案例



## 学习目标

- 能够理解 MVC 模式在项目中的意义
- 能够完成基础的项目骨架
- 能够理解基本的路由设计方式
- 能够掌握模板引擎 layout 布局的使用
- 能够掌握表格拖拽排序的处理流程

- 分类管理
  - 能够使用传统方式完成添加分类
  - 能够使用传统方式完成分类列表展示
  - 能够使用传统方式完成编辑分类
  - 能够使用传统方式完成删除分类
- 用户管理
  - 能够使用Ajax方式添加管理员
  - 能够使用Ajax方式展示管理员列表
  - 能够使用Ajax方式完成编辑管理员
  - 能够使用Ajax方式完成删除管理员
- 用户登录
  - 能够使用传统方式完成用户登录
  - 能够使用Ajax方式完成用户登录

- 文章管理
  - 能够使用Ajax方式完成发布新文章
  - 能够通过查看文档掌握富文本编辑器的使用
  - 能够理解分页技术的交互过程
  - 能够通过查看文档使用客户端分页插件
  - 能够使用Ajax方式完成展示文章列表
  - 能够使用Ajax方式完成编辑文章
  - 能够使用Ajax方式完成删除文章
- 评论管理
  - 能够使用Ajax+分页方式展示评论列表
  - 能够使用Ajax方式删除评论
  - 能够使用Ajax方式操作评论的通过状态
- 网站设置
  - 能够掌握传统方式的表单文件提交前后端处理流程
  - 能够掌握Ajax异步表单文件提交前后端处理流程
  - 能够使用Ajax方式完成网站基本信息设置
- 图片轮播管理
  - 能够使用Ajax方式完成添加轮播项
  - 能够使用Ajax方式展示轮播列表
  - 能够使用Ajax方式编辑轮播项
  - 能够使用Ajax方式删除轮播项
- 菜单管理
  - 能够使用Ajax方式完成添加导航菜单项
  - 能够使用Ajax方式展示导航菜单列表
  - 能够使用Ajax方式编辑导航菜单项
  - 能够使用Ajax方式删除导航菜单项

- 客户端前台
  - 能够使用Ajax方式加载轮播图列表
  - 能够使用Ajax+分页方式加载内容列表
  - 能够使用动态路由导航方式加载内容详情
  - 能够使用Ajax方式完成发布评论
  - 能够使用Ajax+异步分页（加载更多）方式完成评论列表展示



## 准备

### 初始化目录结构

```
.
├── node_modules 第三方包存储目录
├── controllers 控制器
├── models 模型
├── public 静态资源
├── views 视图
├── app.js 应用程序启动入口
├── config.js 应用配置文件
├── .gitignore Git忽略文件
├── package.json 项目包说明文件，用来存储项目名称，第三方包依赖等信息
├── package-lock.json npm产生的包说明文件
└── README.md 项目说明文件
```

### 导入 Express

1. 安装 Express

```bash
npm i express
```

2. 在 `app.js` 中写入以下内容

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Serve listening http://127.0.0.1:3000/'))

```

3. 使用 [nodemon](https://github.com/remy/nodemon) 启动开发模式

```bash
nodemon app.js
```

4. 在浏览器中访问 `http://127.0.0.1:3000/`

### 导入模板

1. 将模板中的 html 静态文件放到项目的 `views` 目录中
2. 将模板中的静态资源放到 `public` 目录中

3. 在 Web 服务中把 `public` 目录开放出来

```javascript
...

const path = require('path')

app.use('/public', express.static(path.join(__dirname, './public')))

...

```

### 导入模板引擎渲染页面

> 参考文档：
>
> - https://aui.github.io/art-template/express/

1. 安装

```bash
npm i art-template express-art-template
```

2. 配置

```bash
...

// res.render() 的时候默认去 views 中查找模板文件
// 如果想要修改，可以使用下面的方式
app.set('views', '模板文件存储路径')

// express-art-template 内部依赖了 art-template
app.engine('html', require('express-art-template'));
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
})

...
```

3. 使用

```javascript
app.get('/', (req, res, next) => {
  res.render('index.html')
})

```

4. 修改页面中的静态资源引用路径让页面中的资源正常加载

### 提取模板页

> 参考文档：
>
> - [art-template 模板继承](https://aui.github.io/art-template/docs/syntax.html#Template-inheritance)
> - [art-template 子模板](https://aui.github.io/art-template/docs/syntax.html#Sub-template)

### 拆分路由模块

1. 创建 `router.js` 文件模块

```javascript
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.render('index.html'))

module.exports = router

```

2. 在 app.js 中挂载路由模块

```javascript
...
const router = require('./router')

app.use(router)

...
```



### 导入数据库

- 新建一个数据库命名为 `alishow`
- 在 `alishow` 数据库中执行下发的数据库文件 `ali.sql`

### 封装数据库操作模块

> 参考文档：
>
> - https://github.com/mysqljs/mysql

在 `utils/db.js` 中

```javascript
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'alishow62'
})

// 导出连接对象
// 连接对象中有 query 方法
// 注意：必须导出 connection，否则会报错
module.exports = connection

```



## 分类管理

### 分类列表

一、页面加载，发起 Ajax 请求，获取分类列表数据，等待响应

```javascript
$.ajax({
  url: '/api/categories',
  method: 'GET',
  data: {},
  dataType: 'json',
  success: function (data) {
    // 1. 判断数据是否正确
    // 2. 使用模板引擎渲染列表数据
    // 3. 把渲染结果替换到列表容器中
    console.log(data)
  },
  error: function (err) {
    console.log('请求失败了', err)
  }
})

```



二、服务端收到请求，提供请求方法为 `GET`, 请求路径为 `/api/categories` 的路由，响应分类列表数据

```javascript
router.get('/api/categories', (req, res, next) => {
  // 1. 操作数据库获取数据
  db.query('SELECT * FROM `ali_cate`', function (err, data) {
    if (err) {
      throw err
    }
    
  	// 2. 把数据响应给客户端
    res.send({
      success: true,
      data
    })
  })
})

```

三、客户端正确的收到服务端响应的数据了，使用数据结合模板引擎渲染页面内容

模板字符串：

```html
<script type="text/html" id="list_template">
  {%each listData%}
  <tr>
    <td class="text-center"><input type="checkbox"></td>
    <td>{% $value.cate_name %}</td>
    <td>{% $value.cate_slug %}</td>
    <td class="text-center">
      <a href="javascript:;" class="btn btn-info btn-xs">编辑</a>
      <a data-id="{% $value.cate_id %}" name="delete" href="javascript:;" class="btn btn-danger btn-xs">删除</a>
    </td>
  </tr>
  {%/each%}
</script>

<script>
  // template('script 节点 id')
  // 当前页面是由服务端渲染出来的
  // 服务端先先对当前页面进行模板引擎处理
  // 服务端处理的时候根本不关心你的内容，只关心模板语法，我要解析替换
  // 当你的服务端模板引擎语法和客户端模板引擎语法一样的时候，就会产生冲突
  //    服务端会把客户端的模板字符串页给解析掉
  //    这就是所谓的前后端模板语法冲突
  
  // 修改模板引擎的语法界定符
  template.defaults.rules[1].test = /{%([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*%}/;
</script>

```

后续处理：

```javascript
<script>
  loadList()
  
  /*
   * 加载分类列表数据
   */
  function loadList() {
    $.ajax({
      url: '/api/categories',
      method: 'GET',
      data: {},
      dataType: 'json',
      success: function (data) {
        // 1. 判断数据是否正确
        // 2. 使用模板引擎渲染列表数据
        // 3. 把渲染结果替换到列表容器中
        if (data.success) {
          var htmlStr = template('list_template', {
            listData: data.data
          })
          $('#list_container').html(htmlStr)
        }
      },
      error: function (err) {
        console.log('请求失败了', err)
      }
    })
  }
</script>
```

总结：

- 客户端发起请求
- 服务端收到请求
- 服务端处理请求
- 服务端发送响应
- 客户端收到响应
- 客户端根据响应结果进行后续处理

### 删除分类

一、通过事件委托方式为动态渲染的删除按钮添加点击事件

```javascript
...

$('#list_container').on('click', 'a[name=delete]', handleDelete)

...
```

二、在删除处理中发起 Ajax 请求删除操作

```javascript
function handleDelete() {
  if (!window.confirm('确认删除吗？')) {
    return
  }
  var id = $(this).data('id')
  // 点击确定，发起 Ajax 请求，执行删除操作
  $.ajax({
    url: '/api/categories/delete',
    method: 'GET',
    data: {
      id: id
    },
    dataType: 'json',
    success: function (data) {
      console.log(data)
    },
    error: function (err) {
      console.log(err)
    }
  })
  return false
}
```

三、在服务端添加路由接口处理删除操作

```javascript
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
```

四、客户端收到响应结果，判断如果删除成功，重新请求加载数据列表

```javascript
...

success: function (data) {
  if (data.success) {
    // 删除成功，重新加载列表数据
    loadList()
  }
}

...
```



### 添加分类

基本步骤：

1. 客户端发起请求，提交表单数据，等待服务端响应
2. 服务端收到请求，处理请求，发送响应
3. 客户端收到响应，根据响应结果进行后续处理

 

一、客户端发起添加请求

- 表单的 submit 提交事件
- 表单内容的获取 `$(表单).serialize()`

```javascript
// 表单提交
//  submit 提交事件
//  1. button 类型为 submit 的会触发
//  2. 文本框敲回车也会触发
$('#add_form').on('submit', handleAdd)

function handleAdd() {
  // serialize 会找到表单中所有的带有 name 的表单元素，提取对应的值，拼接成 key=value&key=value... 的格式数据
  var formData = $('#add_form').serialize()
  $.ajax({
    url: '/api/categories/create',
    method: 'POST',
    data: formData,
    // Content-Type 为 application/x-www-form-urlencoded
    // data: { // data 为对象只是为了让你写起来方便，最终在发送给服务器的时候，$.ajax 还会把对象转换为 key=value&key=value... 的数据格式
    // 普通的表单 POST 提交（没有文件），必须提交格式为 key=value&key=value... 数据，放到请求体中
    //   key: value,
    //   key2: value2
    // },
    dataType: 'json',
    success: function (resData) {
      console.log(resData)
    },
    error: function (error) {
      console.log(error)
    }
  })
  return false
}
```



二、服务端处理请求

1. 在 app.js 中配置解析表单 POST 请求体

```javascript
...

/**
 * 配置解析表单 POST 请求体（只能解析 Content-Type 为 application/x-www-form-urlencoded 数据）
 * 配置好以后，我们就可以在请求处理函数中通过 req.body 获取请求体数据
 * express 已经内置 body-parser
 * express 通过 express.urlencoded 方法包装了 body-parser
 */
app.use(express.urlencoded())

...
```



2. 执行数据库操作和发送响应数据

```javascript
router.post('/api/categories/create', (req, res, next) => {
  // 1. 获取表单数据
  const body = req.body
  
  // 2. 验证数据的有效性（永远不要相信客户端的输入）

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
```

三、客户端收到响应，后续处理

- 判断响应是否正确
- 如果正确，则重新加载最新的列表数据，清空表单内容

```javascript
...

success: function (resData) {
  if (data.success) {
    // 添加成功，重新加载列表数据
    loadList()
    
    // 清空表单内容
		$('#add_form').find('input[name]').val('')
  }
}

...
```



### 编辑分类

#### 动态显示编辑模态框

一、点击编辑，弹出模态框

- Bootstrap 自带的 JavaScript 组件：模态框

二、发起 Ajax 请求，获取 id=xxx 的分类数据

三、服务端收到请求，获取 id，操作数据库，发送响应

四、客户端收到服务端响应，进行后续处理

#### 提交编辑表单完成编辑操作

一、注册编辑表单的提交事件

二、在提交事件中，获取表单数据，发送 Ajax  `POST`请求 `/api/categories/update`，提交的数据放到请求体中

- **表单隐藏域的使用**

三、服务端收到请求，获取查询字符串中的 id，获取请求体，执行数据库修改数据操作，发送响应

四、客户端收到响应，根据响应结果做后续处理



## 简单优化

### 使用连接池操作数据库

```javascript
const mysql = require('mysql')

/**
 * 使用连接池连接操作数据库
 */
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'alishow62'
})

module.exports = pool

```



### 拆分路由模块

- 按照业务分类将不同的路由放到不同的路由模块
- 自动加载路由模块
  - 使用 [glob](https://github.com/isaacs/node-glob) 获取指定的文件路径
  - 循环路由模块文件路径挂载路由模块

```javascript
// 获取 routes 目录中所有的路由文件模块路径
const routerFiles = glob.sync('./routes/**/*.js')

// 循环路由模块路径，动态加载路由模块挂载到 app 中
routerFiles.forEach(routerPath => {
  const router = require(routerPath)
  if (typeof router === 'function') {
    // router.prefix 是我们添加的自定义属性，作用是用来设定路由的模块的访问前缀
    // 当路由模块没有 prefix 的时候，我们给一个 / 作为默认值，相当于没有前缀限制。
    // 因为所有的请求路径都以 / 开头
    app.use(router.prefix || '/', router)
  }
})

```



### 客户端表单数据验证

- 自己写，自己判断
- [HTML5 表单验证](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Forms/Data_form_validation)
- 基于 jQuery 的表单验证插件
  - 官方文档：https://jqueryvalidation.org/
  - Github 仓库：https://github.com/jquery-validation/jquery-validation
  - 菜鸟教程翻译的一个参考文档：http://www.runoob.com/jquery/jquery-plugin-validate.html

### 服务端数据验证

- 基本数据校验
- 业务数据校验

### 服务端全局错误处理

- 利用中间件：http://expressjs.com/en/guide/error-handling.html

### 客户端统一错误处理

- 利用 jQuery 提供的全局 Ajax 事件处理函数：https://api.jquery.com/category/ajax/global-ajax-event-handlers/

































## 用户管理

### 用户列表

1. 添加路由，渲染 admin/users.html 页面
2. 在 users.html 页面中套用模板页

几个小点：

- 把 art-template 文件资源的引用放到模板页中
- 把修改模板引擎默认语法规则的代码放到模板页中
- 把注册的全局 Ajax 错误处理方法放到模板页中

### 添加用户

- 插件表单验证
- 异步请求验证

### 删除用户

### 编辑用户



## 用户登录

- 基本登录流程处理
- 记录用户登录状态
- 基本的页面访问权限认真，如果用户没有登录，则让用户跳转到登录页面进行登录



## 状态保持

### Cookie 和 Session

- Cookie 发橘子，往背后贴纸条
- Session 超市存物柜，东西放到柜子里，你拿着小票

### 配置使用 express-session 中间件

> 参考文档：https://github.com/expressjs/session

1. 安装

```bash
npm i express-session
```

2. 配置

```javascript
...
const session = require('express-session')

app.use(session({
  // 生成密文是有一套算法的来计算生成密文，如果网站都使用默认的密文生成方式， 就会有一定的重复和被破解的概率，所以为了增加这个安全性，算法对外暴露了一个混入私钥的接口，算法在生成密文的时候会混入我们添加的自定义成分
  secret: 'itcast',
  resave: false,
  // 如果为 true 无论是否往 Session 中存储数据，都直接给客户端发送一个 Cookie 小票
  // 如果为 false，则只有在往 Session 中写入数据的时候才会下发小票
  // 推荐设置为 true
  saveUninitialized: true
}))

...
```

3. 使用

```javascript
// 存储 Session 数据
// 就想操作对象一样，往 Session 中写数据
req.session.名字 = 值

// 读取 Session 中的数据
// 就是读取对象成员一样，读取 Session 中的数据
req.session.名字
```



### 页面访问权限控制

```javascript
/**
 * 统一控制后台管理系统的页面访问权限
 * 相当于为所有以 /admin/xxxxx 开头的请求设置了一道关卡
 * 
 */
app.use('/admin', (req, res, next) => {
  // 1. 如果是登录页面 /admin/login，允许通过
  if (req.originalUrl === '/admin/login') {
    // 这里 next() 就会往后匹配调用到我们的那个能处理 /admin/login 的路由
    return next()
  }

  // 2. 其他页面都一律验证登录状态
  const sessionUser = req.session.user
  //    如果没有登录页， 让其重定向到登录页
  if (!sessionUser) {
    return res.redirect('/admin/login')
  }

  // 如果登录了，则允许通过
  // 这里调用 next 就是调用与当前请求匹配的下一个中间件路由函数
  // 例如，当前请求是 /admin/users ，则 next 会找到我们那个匹配 /admin/users 的路由去处理
  //                  /admin/categories ，则 next 会找到我们添加的那个 /admin/categories 的路由去处理
  next()
})

```



### 将模板页面公共的数据放到 `app.locals` 中

> 参考文档：http://expressjs.com/en/4x/api.html#app.locals

简单点就是在每一次 render 页面的时候，把 req.session.user 传到模板中去使用。

当你需要在多个模板中使用相同的模板数据的时候，每一次 render 传递就麻烦了。所以 express  提供了一种简单的方式，我们可以把模板中公用的数据放到 `app.locals` 中。`app.locals` 中的数据可以在模板中直接使用。



### Session 数据持久化

> 参考文档：https://github.com/chill117/express-mysql-session

Session 数据持久化的目的是为了解决服务器重启或者崩溃挂掉导致的 Session 数据丢失的问题。

因为默认情况下 Session 数据是存储在内存中的，服务器一旦重启就会导致 Session 数据丢失。

所了我们为了解决这个问题，把 Session 数据存储到了数据库中。

1. 安装

```bash
npm i express-mysql-session
```

2. 配置

```javascript
...

const session = require('express-session')

/**
 * 配置 Session 数据持久化
 * 参考文档：https://github.com/chill117/express-mysql-session#readme
 * 该插件会自动往数据库中创建一个 sessions 表，用来存储 Session 数据
 */

const MySQLStore = require('express-mysql-session')(session)

const sessionStore = new MySQLStore({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'alishow62'
})

const app = express()

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: sessionStore, // 告诉 express-session 中间件，使用 sessionStore 持久化 Session 数据
}))

...
```



### Session 的过期时间

默认情况下，Session 下发的小票是会话存储，只在用户访问网站期间一直有效，当浏览器关闭，小票就过期丢失了。

如果需要让 Session 持久存储，我们可以通过修改 Session 下发的 Cookie 小票的过期时间来从而修改 Session 的过期时间。

修改方式就是在配置 Session 中间件的位置进行修改。

```javascript
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: sessionStore, // 告诉 express-session 中间件，使用 sessionStore 持久化 Session 数据
  cookie: { // 配置 Session 自动下发的 Cookie 小票的信息
    // Cookie 的过期时间不是给服务器用的，是给客户端用的
    // 客户端在发送 Cookie 到服务器之前会校验 Cookie 的过期时间
    // 如果 Cookie 过期了，客户端就不发送
    // 如果 Cookie 没有过期，客户端才会发送携带过来
    
    // expires 不推荐使用，因为客户端和服务器时间不一定一致
    // expires: '', // 给一个绝对时间，xx年xx月xx日 xx点xx分xx秒，
    maxAge: 1000 * 60 // 相对（滑动）时间，给一个毫秒数，相对于现在的时间往后加 xxx 毫秒，再过期
  }
}))
```

### 记住我

每次往 Session 中写数据的时候，都会重新设置 Cookie 的过期时间。

加入我在登录之后的某个业务操作中往 Session 中写了数据。

用户登录

服务端把（用户名+密码）加密放到 Cookie 中，发送给客户端，设置一个过期时间。



然后在用户每一次请求服务器的时候

1. 检查 Session 中是否有登录状态
2. 如果 Session 中有登录状态，则直接允许通过
3. 如果 Session 中没有登录状态，则检查 Cookie 中是否有记住我的（用户名+密码）信息
   1. 如果有，则拿出来，解密
   2. 如果解密成功，则判断用户名+密码是否正确
   3. 如果正确，则通过 Session 记录登录状态，允许通过，同时把过期时间继续往后推，重新设置 Cookie 的过期时间发送给浏览器



加解密。

对称加解密：加解密使用的私钥必须一致。

加密：

```javascript
const crypto = require('crypto');
const cipher = crypto.createCipher('aes192', '私钥');

let encrypted = cipher.update('要加密的数据', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log(encrypted);
// Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504
```

解密：

```javascript
const crypto = require('crypto');
const decipher = crypto.createDecipher('aes192', '私钥');

const encrypted =
    '要解密的数据';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```



















## 文章管理

### 添加文章

一、客户端表单处理

```javascript
function handleSubmit() {
  // 1. 获取表单数据
  // multipart/form-data
  var formEl = $('#new_form')
  var formData = new FormData(formEl.get(0))

  // 2. 表单提交
  $.ajax({
    url: '/api/posts/create',
    type: 'POST',
    data: formData,
    processData: false,  // 不处理数据
    contentType: false,   // 不设置内容类型
    success: function (resData) {
      // 3. 根据响应结果做后续处理
      console.log(resData)
    },
    error: function (err) {
      console.log(err)
    }
  })
  return false
}

```

二、服务端接口处理





#### 富文本编辑器 Quill 的使用

- github 仓库地址：https://github.com/quilljs/quill
- 下载
  - https://github.com/quilljs/quill/releases
- 基本配置
  - https://quilljs.com/docs/quickstart/

获取内容

```javascript
quill.root.innerHTML
```

设置内容

```javascript
editor.clipboard.dangerouslyPasteHTML(光标位置, 'HTML内容')
```

获取选中的位置

```javascript

```

在指定的位置插入内容

```javascript

```



### 文章列表

### 编辑文章

### 删除文章



## 网站设置

## 个人中心

## 轮播广告管理

