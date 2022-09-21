//创建用户集合并且导出
const mongoose = require('mongoose')
// 创建数据库规则
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    lv: String,
    unlike: [String],
    RatioFund: [Object],
    pieFund: [Object]
})
// 创建集合
const User = mongoose.model('User', userSchema)
// 导出
module.exports = User