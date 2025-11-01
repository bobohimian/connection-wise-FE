// Import commands.js using ES2015 syntax:
import './commands';

// Import cypress-real-events for real mouse interactions
import 'cypress-real-events';

// 注册fps实例
import FPSMonitor from '../utils/fps-monitor';
// 注册全局命令：启动FPS监控
Cypress.Commands.add('startFpsMonitoring', () => {
    Cypress.env('fpsMonitor', new FPSMonitor()); // 将实例存储在Cypress环境变量中
    Cypress.env('fpsMonitor').start();
});

// 注册全局命令：停止监控并返回结果
Cypress.Commands.add('stopFpsMonitoring', () => {
    const monitor = Cypress.env('fpsMonitor');
    if (!monitor) {
        throw new Error('请先调用startFpsMonitoring()启动监控');
    }
    monitor.end();
    return monitor.getResult();
});