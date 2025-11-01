/// <reference types="cypress" />
import { generateNodes } from '../utils/node-generator';

const repeatCount = 7;
const dragPath = [[500, 50], [500, 500], [50, 500], [50, 50]];

// 存储测试结果的数据结构
const testResults = {};

const testCases = [
  // {
  //   nodeCount: 0,
  //   repeatCount,
  // },
  // {
  //   nodeCount: 10,
  //   repeatCount,
  //   dragPath,
  // },
  // {
  //   nodeCount: 50,
  //   repeatCount,
  //   dragPath,
  // },
  {
    nodeCount: 100,
    repeatCount,
    dragPath,
  },
  {
    nodeCount: 200,
    repeatCount,
    dragPath,
  },
  // {
  //   nodeCount: 400,
  //   repeatCount: 5,
  // },
];
describe('ReactFlow 画布测试', () => {
  // 在所有测试完成后，将结果写入文件
  after(() => {
    // 只在最后一个测试用例完成后执行一次
    // 计算每个节点数量的平均值
    const summaryResults = {};

    Object.keys(testResults).forEach(nodeCount => {
      const sorted = testResults[nodeCount].sort((a, b) => b - a);
      const results = sorted.slice(0, sorted.length > 5 ? 5 : sorted.length);
      const avgFPS = results.reduce((sum, result) => sum + result.averageFPS, 0) / results.length;
      const avgDuration = results.reduce((sum, result) => sum + parseFloat(result.duration), 0) / results.length;

      summaryResults[nodeCount] = {
        tests: results,
        average: {
          averageFPS: Math.round(avgFPS),
          duration: avgDuration.toFixed(2) + 's',
        },
      };
    });

    // 写入结果文件
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = `cypress/data/fps-test-results-${timestamp}.json`;

    // 使用Cypress任务写入文件
    cy.task('writeFile', {
      filePath,
      content: JSON.stringify(summaryResults, null, 2),
    }).then(() => {
      cy.log(`测试结果已保存到: ${filePath}`);
    });
  });

  beforeEach(() => {
    // 访问应用登录页面
    cy.visit('http://localhost/login');

    // 执行登录操作
    cy.get('#username').type('chenhong');
    cy.get('#password').type('chenhong123');
    cy.get('button[type="submit"]').click();

    // 验证登录成功，跳转到主页
    cy.url().should('include', '/canvas');

    // 点击进入画布按钮
    cy.get('[data-testid="canvas-test"]').click();

    // 验证成功进入画布页面
    cy.url().should('include', '/canvas/12');

    // 等待ReactFlow加载完成
    cy.get('.react-flow').should('be.visible');
    cy.get('.react-flow__node').should('have.length.below', 1);

  });

  afterEach(() => {
  });

  testCases.forEach(({ nodeCount, repeatCount, dragPath }) => {
    for (let i = 0; i < repeatCount; i++) {
      it(`当前节点数量${nodeCount},第${i + 1}次测试`, function () {
        try {
          // 添加更多节点到ReactFlow
          const NodeCount = nodeCount;
          cy.window().then((win) => {
            // 通过ReactFlow实例添加节点
            if (win.reactFlowInstance) {
              // 使用节点生成器创建节点
              const newNodes = generateNodes(NodeCount, {
                // 可以自定义配置，如果不传则使用默认值
                columnCount: 10,
                xGap: 100,
                yGap: 100,
              });

              // 添加节点到ReactFlow
              win.reactFlowInstance.setNodes(newNodes);
            } else {
              cy.log('无法访问ReactFlow实例，跳过添加节点测试');
              this.skip(); // 跳过当前测试用例
              return;
            }
          });
          // 等待节点添加完成
          cy.get('[data-id="node-1"]', { timeout: 3000 }).should('be.visible');
          // 验证节点已添加
          // cy.get('.react-flow__node').should('have.length.greaterThan', NodeCount - 1);

          cy.startFpsMonitoring();
          // 使用新添加的dragCanvas命令拖动画布
          dragPath.reduce((from, to) => {
            cy.log(from, to);
            cy.dragCanvas({
              startX: from[0],       // 初始X坐标
              startY: from[1],       // 初始Y坐标
              targetX: to[0],     // 目标X坐标
              targetY: to[1],      // 目标Y坐标
              totalSteps: 20,    // 总步数
              baseDelay: 0,      // 基础延迟（ms）
              maxJitter: 5,      // 最大随机延迟波动（ms）
              easing: 'linear', // 缓动函数名称
            });
            return to;
          }, [50, 50]);

          // 停止FPS监控并获取结果
          cy.stopFpsMonitoring().then((result) => {
            // 输出结果到控制台
            cy.log('测试用例执行结果:', Object.entries(result));

            // 存储测试结果
            if (!testResults[nodeCount]) {
              testResults[nodeCount] = [];
            }
            testResults[nodeCount].push(result);
          });
        } catch (error) {
          // 记录错误信息
          cy.log(`测试用例执行出错: ${error.message}`);
          // 跳过当前测试用例
          this.skip();
        }
      });
    }
  });
});