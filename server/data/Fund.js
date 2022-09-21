//创建用户集合并且导出
const mongoose = require('mongoose')
// 创建数据库规则
const fundSchema = new mongoose.Schema({
    name: String,
    price: Number,
    grade: Number,
    link: String
})
// 创建集合
const Fund = mongoose.model('Fund', fundSchema)
// 导出
module.exports = Fund