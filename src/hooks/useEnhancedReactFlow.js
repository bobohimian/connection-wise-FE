import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import { useWSProxy } from './usewsProxy';
const defaultOption = {
  isLocal: true,
};
export function useEnhancedReactFlow() {
  const {
    getNode: getNodeRF,
    getEdge: getEdgeRF,
    setNodes: setNodesRF,
    updateNode: updateNodeRF,
    setEdges: setEdgesRF,
    updateEdge: updateEdgeRF,
    screenToFlowPosition: screenToFlowPositionRF,
  } = useReactFlow();
  const { wsProxy } = useWSProxy();
  const addNode = useCallback((node, options = defaultOption) => {
    setNodesRF((nodes) => nodes.concat(node));
    if (options.isLocal)
      wsProxy.addNode(node);
  }, [setNodesRF, wsProxy]);

  const deleteNode = useCallback((nodeId, options = defaultOption) => {
    setNodesRF((nodes) => nodes.filter((node) => node.id !== nodeId));
    if (options.isLocal)
      wsProxy.deleteNode(nodeId);
  }, [setNodesRF, wsProxy]);

  const updateNode = useCallback((nodeId, path, newValue, options = defaultOption) => {
    // 对函数式更新需要特殊处理
    // if(typeof edge ==="function")

    if (!Array.isArray(path) || path.length === 0) {
      throw new Error('修改路径必须是数组且长度大于0');
    }
    // '[]'::jsonb
    // '[]'::jsonb    
    let currentVersion;
    if (options.isLocal) {
      currentVersion = getNodeRF(nodeId).version || 0;
    }
    const updateFunc = (obj) => {
      const pathLen = path.length;
      const newObj = structuredClone(obj);
      if (options.isLocal) {
        newObj.version = currentVersion + 1;
      }
      let current = newObj;
      for (let i = 0; i < pathLen - 1; i++) {
        const key = path[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
      const lastKey = path[pathLen - 1];
      current[lastKey] = newValue;
      return newObj;
    };
    updateNodeRF(nodeId, updateFunc);
    if (options.isLocal)
      wsProxy.updateNode(nodeId, path, newValue, currentVersion);
  }, [getNodeRF, updateNodeRF, wsProxy]);

  const addEdge = useCallback((edge, options = defaultOption) => {
    setEdgesRF((edges) => edges.concat(edge));
    if (options.isLocal)
      wsProxy.addEdge(edge);
  }, [setEdgesRF, wsProxy]);

  const deleteEdge = useCallback((edgeId, options = defaultOption) => {
    setEdgesRF((edges) => edges.filter((edge) => edge.id !== edgeId));
    if (options.isLocal)
      wsProxy.deleteEdge(edgeId);
  }, [setEdgesRF, wsProxy]);

  const updateEdge = useCallback((edgeId, path, newValue, options = defaultOption) => {

    // 对函数式更新需要特殊处理
    // if(typeof edge ==="function")

    if (!Array.isArray(path) || path.length === 0) {
      throw new Error('修改路径必须是数组且长度大于0');
    }

    let currentVersion;
    if (options.isLocal)
      currentVersion = getEdgeRF(edgeId).version || 0;
    const updateFunc = (obj) => {
      const pathLen = path.length;
      const newObj = structuredClone(obj);
      if (!options.isLocal) {
        newObj.version = currentVersion + 1;
      }
      let current = newObj;
      for (let i = 0; i < pathLen - 1; i++) {
        const key = path[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
      const lastKey = path[pathLen - 1];
      current[lastKey] = newValue;
      return newObj;
    };
    updateEdgeRF(edgeId, updateFunc);
    if (options.isLocal)
      wsProxy.updateEdge(edgeId, path, newValue, currentVersion);
  }, [getEdgeRF, updateEdgeRF, wsProxy]);
  const flushNode = useCallback((nodeId, node) => {
    updateNodeRF(nodeId, node);
  }, [updateNodeRF]);
  const flushEdge = useCallback((edgeId, edge) => {
    updateNodeRF(edgeId, edge);
  }, [updateNodeRF]);
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
    flushNode,
    flushEdge,
    screenToFlowPosition,
  };
}