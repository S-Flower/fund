const app = require('../app')
const express = require('express')
const User = require('../data/User')

//创建接口
app.post('/user', async (req, res) => {
    const formData = req.body
    console.log(formData);
    // 判断用户名是否注册
    const isReg = await User.findOne({ username: formData.username })
    if (isReg != null) {
        return res.send({
            code: 202,
            mas: '用户名已注册请重新输入'
        })
    }
    await User.create(formData)
    // 是否创建成功
    try {
        res.send({
            code: 200,
            mas: '注册成功'
        })
    } catch (err) {
        res.send({
            code: 202,
            mas: '创建失败请联系管理员'
        })
    }
})
// 登陆验证
app.post('/login', async (req, res) => {
    const formData = req.body
    const Account = await User.findOne({ username: formData.username })
    // 判断账号密码是否正确
    if (Account == null) return res.send({
        mas: '用户名不存在',
        code: 202,
        isReg: false
    })
    if (Account.password == formData.password) {
        res.send({
            mas: '账号密码正确',
            code: 200,
            AccountData: Account
        })
    } else {
        res.send({
            mas: '密码错误请重新输入',
            code: 202,
        })
    }

})
// 问卷评分修改接口
app.get('/user/fraction', async (req, res) => {
    const { username, lv } = req.query
    try {
        const update = await User.findOneAndUpdate({ username: username }, { lv: lv })
        update.lv = lv
        console.log(update.lv);
        res.send({
            mas: '提交成功',
            code: 200,
            update: update
        })
    } catch (err) {
        res.send({
            mas: '提交错误,请重试或联系管理员',
            code: 202
        })
    }
})
// unlink数据修改接口
app.post('/FundData/revise', async (req, res) => {
    const { FundDataId, userId } = req.body
    try {
        // 将基金id添加到用户unlink数组中
        const user = await User.findOne({ _id: userId })
        var unlikeList = user.unlike
        unlikeList.push(FundDataId)
        // 更新到用户数据上
        const userRevise = await User.findOneAndUpdate({ _id: userId }, { unlike: unlikeList })
        userRevise.unlike = unlikeList
        res.send({
            mas: '操作成功',
            code: 200,
            userRevise
        })
    } catch (err) {
        res.send({
            mas: '操作错误，请重试或联系管理员',
            code: 202
        })
    }

})
// 用户重置不喜欢基金数据
app.get('/user/reset', async (req, res) => {
    const user = req.query
    try {
        const userReset = await User.findOneAndUpdate({ user }, { unlike: [] })
        userReset.unlike = []
        console.log(userReset.unlike);
        res.send({
            mas: '操作成功',
            code: 200,
            userReset
        })
    } catch (err) {
        res.send({
            mas: '操作错误，请重试或联系管理员',
            code: 202
        })
    }

})
// 配比基金数据接口
app.post('/user/ratio', async (req, res) => {
    const { FundName, price, FundNum, username } = req.body

    // 获取用户原本的配比基金数据 判断RatioFund是否已经包含了此基金
    try {
        const { RatioFund } = await User.findOne({ username })
        // console.log(User.findOne({ username }));
        // console.log(RatioFund.length);
        if (RatioFund.length == 0) {
            RatioFund.push({
                FundName,
                price: (price * FundNum).toFixed(2) - 0,
            })
        } else {
            // 判断RatioFund是否已经包含了此基金
            let editIndex = -1
            RatioFund.forEach((item, i) => {
                // console.log(item.FundName, FundName);
                if (item.FundName == FundName) {

                    editIndex = i
                }
            })


            if (editIndex !== -1) {
                const newPrice = (price * FundNum).toFixed(2) - 0
                const oldPrice = RatioFund[editIndex].price - 0
                RatioFund[editIndex].price = (newPrice + oldPrice).toFixed(2) - 0
            } else {
                RatioFund.push({
                    FundName,
                    price: (price * FundNum).toFixed(2) - 0,
                })
            }
        }
        // 更新用户数据
        const newUser = await User.findOneAndUpdate({ username }, { RatioFund: RatioFund })
        newUser.RatioFund = RatioFund
        // console.log(newUser);
        res.send({
            mas: '购入成功',
            code: 200,
            newUser
        })
    } catch (err) {
        res.send({
            mas: '购入失败，请联系管理员或重试',
            code: 202
        })
    }

})
// 配置饼图那个用户渲染饼图并返回数据
app.post('/user/pieData', async (req, res) => {
    const { username } = req.body
    try {
        const { RatioFund } = await User.findOne({ username })
        var newPieFund = []
        RatioFund.forEach(item => {

            newPieFund.push({
                name: item.FundName,
                value: item.price
            })
        })
        const { pieFund } = await User.findOneAndUpdate({ username }, { pieFund: newPieFund })
        res.send({
            code: 200,
            mas: '购买成功',
            pieFund
        })
    } catch (err) {
        res.send({
            code: 202,
            mas: '购买错误，请重试或联系管理员'
        })
    }
})
// 最新的用户数据接口
app.post('/user/newUser', async (req, res) => {
    const { username } = req.body
    try {
        const newUser = await User.findOne({ username })
        res.send({
            code: 200,
            newUser
        })
    } catch (err) {
        res.send({
            code: 202,
            mas: '数据获取失败,请刷新或联系管理员'
        })
    }
})
