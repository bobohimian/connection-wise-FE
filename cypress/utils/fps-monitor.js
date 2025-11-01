class FPSMonitor {
  constructor() {
    this.frameCount = 0;       // 总帧数
    this.startTime = null;     // 监控开始时间（毫秒级时间戳）
    this.endTime = null;       // 监控结束时间
    this.animationFrameId = null; // requestAnimationFrame返回的ID（用于取消）
  }

  /**
   * 开始监控FPS
   */
  start() {
    this.reset(); // 重置状态
    this.startTime = performance.now(); // 使用高精度时间API

    // 定义动画帧回调（递归调用实现持续监控）
    const tick = () => {
      this.frameCount++;
      this.animationFrameId = requestAnimationFrame(tick);
    };

    // 启动第一帧监控
    this.animationFrameId = requestAnimationFrame(tick);
  }

  /**
   * 停止监控
   */
  end() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId); // 终止动画帧循环
      this.animationFrameId = null;
    }
    this.endTime = performance.now(); // 记录结束时间
  }

  /**
   * 获取统计结果
   * @returns {Object} 包含平均FPS、总帧数、监控时长的对象
   */
  getResult() {
    if (!this.startTime || !this.endTime) {
      throw new Error('请先调用start()和end()方法');
    }

    const durationSec = (this.endTime - this.startTime) / 1000; // 转换为秒
    const averageFPS = durationSec > 0 ? Math.round(this.frameCount / durationSec) : 0;

    return {
      averageFPS,    // 平均FPS（四舍五入取整）
      frameCount:this.frameCount,    // 总渲染帧数
      duration: durationSec.toFixed(2) + 's' // 监控时长（带单位）
    };
  }

  /**
   * 重置内部状态（私有方法）
   */
  reset() {
    this.frameCount = 0;
    this.startTime = null;
    this.endTime = null;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

export default FPSMonitor;