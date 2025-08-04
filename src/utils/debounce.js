/**
 * 防抖函数（基础版）
 * @param {Function} func 需要防抖的目标函数
 * @param {number} delay 延迟时间（毫秒），默认 300ms
 * @returns {Function} 防抖后的函数
 */
/* eslint-disable */
function debounce(func, delay = 300) {
    let timer = null; // 存储定时器 ID

    // 返回防抖后的函数
    return function debounced(...args) {
        const context = this; // 保存当前上下文（this）

        // 清除上一次的定时器（避免重复执行）
        if (timer) clearTimeout(timer);

        // 重新设置定时器，延迟执行目标函数
        timer = setTimeout(() => {
            func.apply(context, args); // 绑定上下文并传递参数
        }, delay);
    };
}