// 入口模块
// 导入express模块
const express = require('express')
// 开启服务器
const app = express()
// 导出app
module.exports = app

// 解决跨域
const cors = require('cors')
app.use(cors())
// 解析
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// 执行链接数据库
require('./data/connect')
// 执行接口
// 用户路由
require('./router/UserRouter')
// 基金路由
require('./router/fundRouter')

// 监听服务器
app.listen('1234', () => {
    console.log('服务器启动成功');
})