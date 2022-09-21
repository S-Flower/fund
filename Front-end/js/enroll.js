// const { unlink } = require("fs");

// 判断
const username = document.querySelector(".username");
const password = document.querySelector(".password");
const sure = document.querySelector(".sure");
const btn = document.querySelector(".btn");
const bg = document.querySelector(".bg");
const tip = document.querySelector(".tip");
const provision = document.querySelector(".provision ");
// 注册按钮的点击事件
btn.onclick = async function () {
    // 正则表达式
    const usernameReg = /^[a-zA-Z0-9_]{3,9}$/
    const passwordReg = /^[a-zA-Z0-9_.]{4,12}$/
    // 获取表单的值
    const UserValue = username.value;
    const passwordValue = password.value;
    const sureValue = sure.value;
    // 进行输入值的判断
    if (usernameReg.test(UserValue) == false || UserValue === "") {
        UserValue === '' ? show('请输入账号') : show('请输入合法用户名')
        return
    } else if (passwordValue === "" || passwordReg.test(passwordValue) == false) {

        passwordValue === '' ? show('请输入密码') : show('请输入规范密码')
        return
    } else if (sureValue != passwordValue || sureValue === "") {
        show("两次密码不一致")
        return
    } else if (provision.checked === false) {
        show("请同意用户协议")
        return
    }

    // 提交到数据库进行创建
    const User = {
        username: UserValue,
        password: passwordValue,
        lv: 0,
    }
    const data = await ajax.post('http://localhost:1234/user', User)
    const status = data.code
    // 判断状态码进行弹窗
    if (status == 202) {
        username.value = ''
        show(data.mas)
    } else {

        show(data.mas, function () {
            location.href = 'login.html'
        })
    }
};