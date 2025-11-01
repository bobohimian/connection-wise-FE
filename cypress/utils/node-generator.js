/**
 * 节点生成器工具函数
 * 用于生成ReactFlow节点数组，可用于测试和开发
 */

/**
 * 生成指定数量的节点数组
 * @param {number} count - 要生成的节点数量
 * @param {Object} options - 配置选项
 * @param {string} options.nodeType - 节点类型，默认为'textNode'
 * @param {number} options.startX - 起始X坐标，默认为100
 * @param {number} options.startY - 起始Y坐标，默认为300
 * @param {number} options.columnCount - 每行节点数量，默认为10
 * @param {number} options.xGap - 节点横向间距，默认为50
 * @param {number} options.yGap - 节点纵向间距，默认为50
 * @param {string} options.className - 节点CSS类名，默认为'flow-node-added'
 * @param {Function} options.textGenerator - 自定义文本生成函数，接收索引作为参数
 * @returns {Array} 生成的节点数组
 */
export const generateNodes = (count, options = {}) => {
  // 默认配置
  const config = {
    nodeType: 'textNode',
    startX: 100,
    startY: 300,
    columnCount: 10,
    xGap: 50,
    yGap: 50,
    className: 'flow-node-added',
    textGenerator: (index) => `节点 ${index}`,
    ...options,
  };

  const newNodes = [];

  // 创建指定数量的节点
  for (let i = 0; i < count; i++) {
    // 计算节点位置（网格布局）
    const x = config.startX + (i % config.columnCount) * config.xGap;
    const y = config.startY + Math.floor(i / config.columnCount) * config.yGap;

    // 生成节点文本
    const nodeText = typeof config.textGenerator === 'function'
      ? config.textGenerator(i)
      : `节点 ${i}`;

    // 创建节点对象
    newNodes.push({
      id: `node-${i}`,
      type: config.nodeType,
      position: { x, y },
      data: { text: nodeText },
      className: config.className,
      // hidden: true,
    });
  }

  return newNodes;
};
