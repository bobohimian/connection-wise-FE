import { useSelector } from "react-redux";
import { usewsProxy } from "./usewsProxy";
import { useReactFlow } from "@xyflow/react";
import { selectUser } from "../store/slices/user";
export function useEnhancedReaceFlow() {
    const {
        setNodes: setNodesRF,
        updateNode: updateNodeRF,
        updateNodeData: updateNodeDataRF,
        setEdges: setEdgesRF,
        updateEdge: updateEdgeRF,
        screenToFlowPosition: screenToFlowPositionRF,
    } = useReactFlow();
    const { wsProxy } = usewsProxy();

    const addNode = (node, options = { usews: true }) => {
        setNodesRF((nodes) => nodes.concat(node));
        if (options?.usews)
            wsProxy.addNode(node);
    }
    const deleteNode = (nodeId, options = { usews: true }) => {
        setNodesRF((nodes) => nodes.filter((node) => node.id !== nodeId));
        if (options?.usews)
            wsProxy.deleteNode(nodeId);
    }
    const updateNode = (nodeId, path, newValue, options = { usews: true }) => {
        // 对函数式更新需要特殊处理
        // if(typeof edge ==="function")

        if (!Array.isArray(path) || path.length === 0) {
            throw new Error("path must be an array and length must be greater than 0");
        }

        const updateFunc = (node, options = { usews: true }) => {
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
        if (options?.usews)
            wsProxy.updateNode(nodeId, path, newValue);
    };
    const updateNodeData = (nodeId, baseObj, path, newValue, options = { usews: true }) => {
        // setEdgesRF((nodes) => nodes.concat(node));
        // wsProxy.addNode( node);
    }


    const addEdge = (edge, options = { usews: true }) => {
        setEdgesRF((edges) => edges.concat(edge));
        if (options?.usews)
            wsProxy.addEdge(edge);
    }
    const deleteEdge = (edgeId, options = { usews: true }) => {
        setEdgesRF((edges) => edges.filter((edge) => edge.id!== edgeId));
        if (options?.usews)
            wsProxy.deleteEdge(edgeId);
    }
    const updateEdge = (edgeId, path, newValue, options = { usews: true }) => {

        // 对函数式更新需要特殊处理
        // if(typeof edge ==="function")

        if (!Array.isArray(path) || path.length === 0) {
            throw new Error("path must be an array and length must be greater than 0");
        }

        const updateFunc = (edge, options = { usews: true }) => {
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
        if (options?.usews)
            wsProxy.updateEdge(edgeId, path, newValue);
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