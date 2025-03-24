import React, { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import webSocketManager from './WebSocketManager';
import dagre from '@dagrejs/dagre';
export const usewsProxy = (url) => {
    url = url ? url : 'ws://localhost:8080/api/ws'
    const wsProxy = webSocketManager.getwsProxy(url)
    return { wsProxy }
}

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 120;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode = {
            ...node,
            targetPosition: isHorizontal ? 'left' : 'top',
            sourcePosition: isHorizontal ? 'right' : 'bottom',
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };

        return newNode;
    });

    return { nodes: newNodes, edges };
};

export const WebSocketProvider = ({ children }) => {
    const { setNodes, setEdges } = useReactFlow();
    const { wsProxy } = usewsProxy();
    const messageHandlers = {
        init: (data) => {
            const { nodes, edges } = data;
            setNodes([...nodes]);
            setEdges([...edges]);
            // const { nodes: layoutedNodes, edges: layoutedEdges } =
            //     getLayoutedElements(nodes, edges, 'TB');

            // setNodes([...layoutedNodes]);
            // setEdges([...layoutedEdges]);
        },
        pong: () => {
            console.log("Receive pong.");
        }
    }
    useEffect(() => {
        for (const [type, handler] of Object.entries(messageHandlers)) {
            wsProxy.registerMessageHandler(type, handler);
        }
    }, [])

    return (children);
};
