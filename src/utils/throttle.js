/**
 * 基础截流函数（定时器模式，保证最后一次执行）
 * @param {Function} func 需要截流的函数
 * @param {number} wait 间隔时间（毫秒）
 * @returns {Function} 截流后的函数
 */
/* eslint-disable */
function throttle(func, wait) {
  let timer = null;
  return function throttled(...args) {
    const context = this; 
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func.apply(context, args); 
      timer = null;
    }, wait);
  };
}