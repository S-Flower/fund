
const btn = document.querySelector(".btn");
const bg = document.querySelector(".bg");
const tip = document.querySelector(".tip");

//判断本地是否有数据
(function () {
    // 获取到本地数据
    const localData = JSON.parse(localStorage.user)
    const shows = ['暂无', '很高', '高', '中等', '低', '很低']
    if (!localStorage.user) return show('未登录，请去登录', function () {
        location.href = 'login.html'
    })
    var RatioFundData = {}
    //如果用户风险等级是零就必须先做问卷
    if (localData.lv == 0) $('.questionnaire').fadeIn()
    // 渲染用户名
    const username = JSON.parse(localStorage.user).username
    $('.home-welcome span').html(username)
    // 渲染风险等级
    var lv = localData.lv - 0
    $('.risk-box span').html(shows[lv])
    // 提交问卷
    $('.submitB').click(async function () {
        var checked = $('.questionnaire input:checked')//选中的所有表单
        let fraction = 0//总分
        if (checked.length < 6) return show('全部选择后在提交')
        checked.each(function (i, item) {
            fraction += item.value - 0
        })
        // 判断分数属于那个等级
        fraction >= 10 && (lv = 1)
        fraction >= 20 && (lv = 2)
        fraction >= 30 && (lv = 3)
        fraction >= 40 && (lv = 4)
        fraction >= 50 && (lv = 5)
        // 发送请求
        const Score = await ajax.get('http://localhost:1234/user/fraction', { username, lv })
        if (Score.code == 200) {
            // 拿到更新后的数据进行重新存储
            localStorage.user = JSON.stringify(Score.update)
            // 重新解析和渲染
            const localData = JSON.parse(localStorage.user)
            var lv = localData.lv - 0
            FundDataF()
            $('.risk-box span').html(shows[lv])
            // 弹窗并且关掉问卷
            show(Score.mas, function () {
                $('.questionnaire').fadeOut()
            })
        }

    })
    // 重新评测
    $('.again').click(function () {
        $('.questionnaire').fadeIn()
    })
    // 关闭
    $('.Shut-down').click(function () {
        const localData = JSON.parse(localStorage.user)
        if (localData.lv == 0) return show('请进行风险评测')
        $('.questionnaire').fadeOut()
    })
    // 修改主题
    $('.home-color').hover(function () {
        $('.subject').toggle('none')
    })
    $('.subject input').change(function () {
        const color = this.value
        $('body')[0].style.setProperty('--mainColor', color)
    })
    // 退出登录
    $('.home-login').click(function () {
        localStorage.clear()
        location.href = 'login.html'
    })
    // 渲染基金数据
    // 像后端请求基金数据
    async function FundDataF() {
        $('#firstItem').html('')
        const localData = JSON.parse(localStorage.user)

        const userAndLv = {
            username: localData.username,
            lv: localData.lv
        }
        const FundData = await ajax.post('http://localhost:1234/FundData', userAndLv)
        FundData.UserFundData == [] ? $('.nodata1').fadeIn() : $('.nodata1').fadeOut()
        // 拿到数据后渲染
        if (FundData.code == 200) {

            $('#firstItem').siblings().remove('.nodata1')
            FundData.UserFundData.forEach(item => {

                if (localData.unlike.indexOf(item._id) != -1) return
                var li = $(`<li>
            <a href="${item.link}">${item.name}</a>
            <em class="price">$${item.price}</em>
            <i class='unlink'>不喜欢</i>
            <i class='add'>添加</i>
            </li>`)
                li[0].findId = item._id
                $('#firstItem').append(li)

            })
        } else {
            show(FundData.mas)
        }
    }
    FundDataF()
    // 不喜欢按钮功能
    $('#firstItem').on('click', '.unlink', async function () {
        const dataId = {
            FundDataId: this.parentNode.findId,
            userId: localData._id
        }
        const revise = await ajax.post('http://localhost:1234/FundData/revise', dataId)
        if (revise.code == 200) {
            // 将返回数据重新渲染到列表上
            localStorage.user = JSON.stringify(revise.userRevise)
            FundDataF()
        } else {
            show(revise.mas)
        }
    })
    // 重置按钮功能
    $('.reset').click(async function () {
        // 向后端发送请求修改数据
        const userReset = await ajax.get('http://localhost:1234/user/reset', { username })
        if (userReset.code != 200) return show(userReset.mas)
        localStorage.user = JSON.stringify(userReset.userReset)
        FundDataF()
    })
    // 添加按钮功能
    $('#firstItem').on('click', '.add', async function () {
        $('.RatioTip').fadeIn()
        const price = ($(this).siblings('.price').html()).replace('$', '') - 0
        const FundName = $(this).siblings('a').html()
        RatioFundData.FundName = FundName
        RatioFundData.price = price
    })
    const count = /^[0-9]{1,}$/
    // 配比基金购买按钮功能
    $('.RatioTipBtn2').click(async function () {
        const FundNum = $('.RatioTip-input').val() - 0
        if (FundNum == 0 || count.test(FundNum) == false) return show('请输入合法数字')
        RatioFundData.FundNum = FundNum
        RatioFundData.username = username
        // 将数据发送到后端
        const returnRatio = await ajax.post('http://localhost:1234/user/ratio', RatioFundData)
        if (returnRatio.code != 200) return show(returnRatio.mas)
        // 拿到更新后的数据进行重新存储
        localStorage.user = JSON.stringify(returnRatio.newUser)
        $('.RatioTip').fadeOut()
        show(returnRatio.mas)
        $('.RatioTip-input').val('')
        renderingRatio()

    })
    // 配比基金弹窗取消功能
    $('.RatioTipBtn1').click(function () {
        $('.RatioTip').fadeOut()
    })

    // 渲染配比基金数据
    async function renderingRatio() {
        $('#second').html('')
        const localData = JSON.parse(localStorage.user)
        const localRatioFund = localData.RatioFund
        localRatioFund.length <= 0 ? $('.nodata2').fadeIn() : $('.nodata2').fadeOut()
        let priceSum = 0//所有基金的价钱
        localRatioFund.forEach(item => {
            priceSum += item.price
        })
        localRatioFund.forEach(item => {
            var li = $(`<li>
            <a href="">${item.FundName}</a>
            <em class="price">$${item.price}</em>
            <i class='add Proportion'>${((item.price / priceSum) * 100).toFixed(2)}%</i>
            </li>`)
            $('#second').append(li)
        })
    }
    renderingRatio()
    // 渲染饼图
    async function renderPie() {
        $('#main').fadeIn()

        // 请求最新的用户数据
        const newUser = await ajax.post('http://localhost:1234/user/newUser', { username })
        if (newUser.code != 200) return show(newUser.mas)
        const pieFund = newUser.newUser.pieFund
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: '基金仓库饼状图',
                    type: 'pie',
                    radius: ['0', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: false,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: pieFund
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
    }
    renderPie()
    // 向后端发送请求渲染饼图
    $('.warehousing').click(async function () {
        const pieData = await ajax.post('http://localhost:1234/user/pieData', { username })
        if (pieData.code != 200) return show(pieData.mas)
        renderPie()
        show(pieData.mas)
    })
})()
