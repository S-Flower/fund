const ajax = {
    send: function (type, url, paramsString) {
        return new Promise((resolve, reject) => {
            // 创建ajax对象
            const xrl = new XMLHttpRequest()
            // 判断请求方式和参数
            if (type == 'get' && paramsString.length > 0) {
                url = url + '?' + paramsString
            }
            xrl.open(type, url);
            // 判断请求方式来确定发送方式
            if (type == 'get') {
                xrl.send();
            } else {
                xrl.setRequestHeader('Content-type', 'application/json')
                xrl.send(JSON.stringify(paramsString));
            }
            // 监听返回
            xrl.onload = function () {
                var type = xrl.getResponseHeader('Content-type')
                let data = xrl.response
                type.includes('application/json') && (data = JSON.parse(data))
                resolve(data);
            };
        })
    },
    get: function (url, pre) {
        var paramsString = ''
        for (var k in pre) {
            paramsString += k + '=' + pre[k] + '&'
        }
        paramsString = paramsString.substring(0, paramsString.length - 1)
        return this.send('get', url, paramsString)
    },
    post: function (url, pre) {
        return this.send('post', url, pre)
    }
}