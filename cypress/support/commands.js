// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * 自定义命令：拖动React Flow画布
 * 允许配置起点、终点、步数、延迟和缓动函数等参数
 * @param {Object} options - 拖动配置选项
 */
Cypress.Commands.add('dragCanvas', (options = {}) => {
  // 默认缓动函数
  const easingFunctions = {
    // 线性（匀速）
    linear: t => t,
    // 缓入（先慢后快）
    easeIn: t => t * t,
    // 缓出（先快后慢）
    easeOut: t => t * (2 - t),
    // 缓入缓出（前半段加速，后半段减速）
    easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  };

  // 合并默认配置和用户配置
  const config = {
    startX: 200,                // 初始X坐标
    startY: 200,                // 初始Y坐标
    targetX: 800,               // 目标X坐标
    targetY: 600,               // 目标Y坐标
    totalSteps: 10,             // 总步数
    baseDelay: 0,               // 基础延迟（ms）
    maxJitter: 0,               // 最大随机延迟波动（ms）
    easing: 'easeInOut',    // 缓动函数名称
    selector: '.react-flow',    // 画布选择器
    ...options,                  // 用户自定义配置覆盖默认值
  };

  // 获取缓动函数（如果提供的是函数名，则从预设中获取）
  const easingFn = typeof config.easing === 'function'
    ? config.easing
    : (easingFunctions[config.easing] || easingFunctions.easeInOutQuad);

  // 计算总位移
  const deltaX = config.targetX - config.startX;
  const deltaY = config.targetY - config.startY;

  // 开始拖动操作
  return cy.get(config.selector)
    .realMouseDown({ position: { x: config.startX, y: config.startY } })
    .then(() => {
      // 分步移动（使用Cypress命令链保证顺序）
      const movePromises = [];

      for (let step = 0; step <= config.totalSteps; step++) {
        // 计算当前进度（0到1之间）
        const progress = step / config.totalSteps;

        // 应用缓动函数（得到0-1的非线性进度）
        const easedProgress = easingFn(progress);

        // 计算当前步的目标坐标（保留浮点避免累积误差）
        const currentX = config.startX + deltaX * easedProgress;
        const currentY = config.startY + deltaY * easedProgress;

        // 计算当前步的延迟（基础延迟+随机扰动）
        const delay = config.baseDelay + Math.random() * config.maxJitter;

        // 生成Cypress命令（使用then链式调用保证顺序）
        const moveStep = () =>
          cy.wait(delay)
            .then(() => cy.get(config.selector).realMouseMove(currentX, currentY));

        movePromises.push(moveStep());
      }

      // 等待所有移动步骤完成，最后强制对齐目标坐标
      return Promise.all(movePromises).then(() => {
        cy.get(config.selector).realMouseMove(config.targetX, config.targetY);
      });
    })
    .realMouseUp();
});
