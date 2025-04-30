import { usewsProxy } from "./usewsProxy";
import { useReactFlow } from "@xyflow/react";
export function useEnhancedReaceFlow() {
    const {
        setNodes: setNodesRF,
        updateNode: updateNodeRF,
        updateNodeData: updateNodeDataRF,
        setEdges: setEdgesRF,
        updateEdge: updateEdgeRF,
        screenToFlowPosition:screenToFlowPositionRF,
    } = useReactFlow();
    const { wsProxy } = usewsProxy();
    const canvasId = 1;

    const addNode = (node) => {
        console.log("addNode", node);
        setNodesRF((nodes) => nodes.concat(node));
        wsProxy.addNode(canvasId, node);
    }
    const deleteNode = (nodeId) => {
        console.log("deleteNode", nodeId);
        wsProxy.deleteNode(canvasId, nodeId);
    }
    const updateNode = (nodeId, path, newValue) => {
        console.log("updateNode", nodeId, path, newValue);
        // 对函数式更新需要特殊处理
        // if(typeof edge ==="function")

        if (!Array.isArray(path) || path.length === 0) {
            throw new Error("path must be an array and length must be greater than 0");
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
        }
        updateNodeRF(nodeId, updateFunc);
        wsProxy.updateNode(canvasId, nodeId, path, newValue);
    };
    const updateNodeData = (nodeId, baseObj, path, newValue) => {
        // setEdgesRF((nodes) => nodes.concat(node));
        // wsProxy.addNode(canvasId, node);
        
    }


    const addEdge = (edge) => {
        console.log("addEdge", edge);
        setEdgesRF((edges) => edges.concat(edge));
        wsProxy.addEdge(canvasId, edge);
    }
    const deleteEdge = (edgeId) => {
        console.log("deleteEdge", edgeId);
        wsProxy.deleteEdge(canvasId, edgeId);
    }
    const updateEdge = (edgeId, path, newValue) => {

        // 对函数式更新需要特殊处理
        // if(typeof edge ==="function")

        if (!Array.isArray(path) || path.length === 0) {
            throw new Error("path must be an array and length must be greater than 0");
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
        }
        updateEdgeRF(edgeId, updateFunc);
        wsProxy.updateEdge(canvasId, edgeId, path, newValue);
    };

    const screenToFlowPosition = (position) => {
        return screenToFlowPositionRF(position);
    }
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