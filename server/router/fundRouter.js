const app = require('../app')
const express = require('express')
const Fund = require('../data/Fund')
const FundData = require('../data/FundData')
// 将基金数据写入数据库
// FundData.forEach(async item => {
//     const res = await Fund.create(item)
//     console.log(res);
// })
// 请求基金数据
app.post('/FundData', async (req, res) => {
    const { username, lv } = req.body
    try {
        // 查找和用户风险等级相匹配的基金数据
        const UserFundData = await Fund.find({ grade: lv })
        res.send({
            mas: '请求数据成功',
            code: 200,
            UserFundData
        })

    } catch (err) {
        res.send({
            mas: '请求数据错误请联系管理员',
            code: 202
        })
    }
})
