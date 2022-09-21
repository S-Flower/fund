
// 提示框弹出函数
function show(text, callback) {
    bg.style.opacity = 0.4;
    tip.style.display = "block";
    tip.children[0].innerHTML = text;
    // 提示框的点击事件
    tip.children[1].onclick = function () {
        tip.style.display = "none";
        bg.style.opacity = 1;
        // 判断Callback是否是一个函数在调用
        (callback instanceof Function) && callback()
    }
}