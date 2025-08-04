import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import { useWSProxy } from './usewsProxy';

export function useEnhancedReactFlow() {
  const {
    setNodes: setNodesRF,
    updateNode: updateNodeRF,
    setEdges: setEdgesRF,
    updateEdge: updateEdgeRF,
    screenToFlowPosition: screenToFlowPositionRF,
  } = useReactFlow();
  const { wsProxy } = useWSProxy();

  const addNode = useCallback((node, options = { usews: true }) => {
    setNodesRF((nodes) => nodes.concat(node));
    if (options?.usews)
      wsProxy.addNode(node);
  }, [setNodesRF, wsProxy]);

  const deleteNode = useCallback((nodeId, options = { usews: true }) => {
    setNodesRF((nodes) => nodes.filter((node) => node.id !== nodeId));
    if (options?.usews)
      wsProxy.deleteNode(nodeId);
  }, [setNodesRF, wsProxy]);

  const updateNode = useCallback((nodeId, path, newValue, options = { usews: true }) => {
    // 对函数式更新需要特殊处理
    // if(typeof edge ==="function")

    if (!Array.isArray(path) || path.length === 0) {
      throw new Error('path must be an array and length must be greater than 0');
    }

    const updateFunc = (node) => {
      const pathLen = path.length;
      const newNode = structuredClone(node);
      let current = newNode;
      for (let i = 0; i < pathLen - 1; i++) {
        const key = path[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
      const lastKey = path[pathLen - 1];
      current[lastKey] = newValue;
      return newNode;
    };
    updateNodeRF(nodeId, updateFunc);
    if (options?.usews)
      wsProxy.updateNode(nodeId, path, newValue);
  }, [updateNodeRF, wsProxy]);

  const addEdge = useCallback((edge, options = { usews: true }) => {
    setEdgesRF((edges) => edges.concat(edge));
    if (options?.usews)
      wsProxy.addEdge(edge);
  }, [setEdgesRF, wsProxy]);

  const deleteEdge = useCallback((edgeId, options = { usews: true }) => {
    setEdgesRF((edges) => edges.filter((edge) => edge.id !== edgeId));
    if (options?.usews)
      wsProxy.deleteEdge(edgeId);
  }, [setEdgesRF, wsProxy]);

  const updateEdge = useCallback((edgeId, path, newValue, options = { usews: true }) => {

    // 对函数式更新需要特殊处理
    // if(typeof edge ==="function")

    if (!Array.isArray(path) || path.length === 0) {
      throw new Error('path must be an array and length must be greater than 0');
    }

    const updateFunc = (edge) => {
      const pathLen = path.length;
      const newEdge = structuredClone(edge);
      let current = newEdge;
      for (let i = 0; i < pathLen - 1; i++) {
        const key = path[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
      const lastKey = path[pathLen - 1];
      current[lastKey] = newValue;
      return newEdge;
    };
    updateEdgeRF(edgeId, updateFunc);
    if (options?.usews)
      wsProxy.updateEdge(edgeId, path, newValue);
  }, [updateEdgeRF, wsProxy]);

  const screenToFlowPosition = useCallback((position) =>
    screenToFlowPositionRF(position)
    , [screenToFlowPositionRF]);

  return {
    addNode,
    deleteNode,
    updateNode,
    addEdge,
    deleteEdge,
    updateEdge,
    screenToFlowPosition,
  };
}