import { MarkerType } from '@xyflow/react';
import { v4 as uuid } from 'uuid';
// 转换函数：将后端数据转换为目标格式
const transformGraphData = (backendData) => {
  // 存储节点 ID 映射（旧 ID -> 新 UUID）
  const nodeIdMap = {};

  // 转换 nodes
  const transformedNodes = backendData.nodes.map((node) => {
    const newId = uuid();
    nodeIdMap[node.id] = newId; // 记录旧 ID 到新 ID 的映射，用于 edges 处理
    return {
      id: `${newId}`,
      data: {
        text: `${node.title} - ${node.content}`, // 使用 '-' 拼接 title 和 content
        theme: 'bg-linear-to-r from-purple-300 via-indigo-300 to-blue-300', // 默认主题
      },
      type: 'textNode', // 默认类型
      position: {
        x: 0,
        y: 0,
      }, // 位置后续处理
    };
  });

  // 转换 edges
  const transformedEdges = backendData.edges.map((edge) => ({
    id: `${uuid()}`, // 生成唯一 ID
    type: 'curvedEdge', // 默认类型
    source: nodeIdMap[edge.source], // 使用节点的 UUID
    target: nodeIdMap[edge.target], // 使用节点的 UUID
    animated: true, // 默认动画效果
    data: {
      label: edge.relation, // 关系描述作为 label
    },
    markerEnd:{
      type: MarkerType.Arrow,
      width: 20,
      height: 20,
      color: '#4caf50',
    },
  }));

  // 返回转换后的数据
  return {
    nodes: transformedNodes,
    edges: transformedEdges,
  };
};
export { transformGraphData };