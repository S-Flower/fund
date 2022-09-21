const username = document.querySelector(".username");
const password = document.querySelector(".password");
const btn = document.querySelector(".btn");
const bg = document.querySelector(".bg");
const tip = document.querySelector(".tip");
// 判断本地是否有数据
(function () {
    if (localStorage.user) {
        location.href = 'index.html'
    }

    // 判断登录是否正确

    // 登录按钮的点击事件
    btn.onclick = async function () {
        // 获取表单的值
        const UserValue = username.value;
        const passwordValue = password.value;
        // 进行输入值的判断
        if (UserValue === "") {
            show('请输入账号')
        } else if (passwordValue === "") {
            show('请输入密码')
        }
        // 进行登录判断 提交到后端数据库进行判断
        const User = {
            username: UserValue,
            password: passwordValue,
        }
        const data = await ajax.post('http://localhost:1234/login', User)
        console.log(data);
        // 判断后端验证账号返回的信息
        if (data.code === 200) {
            // 进入网站
            location.href = 'index.html'
            localStorage.user = JSON.stringify(data.AccountData)
        }
        if (data.code == 202) {
            show(data.mas)
            password.value = ''
        }
        if (data.isReg == false) {
            show(data.mas)
        }
    };
})()