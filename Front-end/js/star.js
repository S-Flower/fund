// 生成星星
const star = document.querySelector(".star");
var boxShadowStr = "";
//   循环生成星星
for (var i = 1; i <= 250; i++) {
    // 获取随机数字
    var rand1 = Math.floor(Math.random() * 2001);
    var rand2 = Math.floor(Math.random() * 1001);
    var rand3 = Math.floor(Math.random() * 10) / 10;
    boxShadowStr += `${rand1}px ${rand2}px 2px 1px rgba(255, 255, 255, ${rand3}),`;
}
boxShadowStr = boxShadowStr.substr(0, boxShadowStr.length - 1);
star.style.boxShadow = boxShadowStr;