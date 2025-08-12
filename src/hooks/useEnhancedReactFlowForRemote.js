import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
const defaultOption = {
    isLocal: true,
};
export function useEnhancedReactFlowForRemote() {
    const {
        setNodes: setNodesRF,
        updateNode: updateNodeRF,
        setEdges: setEdgesRF,
        updateEdge: updateEdgeRF,
        screenToFlowPosition: screenToFlowPositionRF,
    } = useReactFlow();

    const addNode = useCallback((node) => {
        setNodesRF((nodes) => nodes.concat(node));
    }, [setNodesRF]);

    const deleteNode = useCallback((nodeId) => {
        setNodesRF((nodes) => nodes.filter((node) => node.id !== nodeId));
    }, [setNodesRF]);

    const updateNode = useCallback((nodeId, path, newValue) => {
        // 对函数式更新需要特殊处理
        // if(typeof edge ==="function")
        if (!Array.isArray(path) || path.length === 0) {
            throw new Error('修改路径必须是数组且长度大于0');
        }
        // '[]'::jsonb
        // '[]'::jsonb    
        const updateFunc = (obj) => {
            const pathLen = path.length;
            const newObj = structuredClone(obj);
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
    }, [updateNodeRF]);

    const addEdge = useCallback((edge) => {
        setEdgesRF((edges) => edges.concat(edge));
    }, [setEdgesRF]);

    const deleteEdge = useCallback((edgeId) => {
        setEdgesRF((edges) => edges.filter((edge) => edge.id !== edgeId));
    }, [setEdgesRF]);

    const updateEdge = useCallback((edgeId, path, newValue) => {
        // 对函数式更新需要特殊处理
        // if(typeof edge ==="function")

        if (!Array.isArray(path) || path.length === 0) {
            throw new Error('修改路径必须是数组且长度大于0');
        }

        const updateFunc = (obj) => {
            const pathLen = path.length;
            const newObj = structuredClone(obj);
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
    }, [updateEdgeRF]);
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