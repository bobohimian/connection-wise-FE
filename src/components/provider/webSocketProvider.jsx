import React, { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import webSocketManager from './webSocketManager';
export const usewsProxy = (url) => {
    url = url ? url : 'ws://localhost:3001'
    const wsProxy = webSocketManager.getwsProxy(url)
    return { wsProxy }
}
export const WebSocketProvider = ({ children }) => {
    const { setNodes, setEdges } = useReactFlow();
    const { wsProxy } = usewsProxy();
    const messageHandlers = {
        init: (data) => {
            const { nodes, edges } = data;
            setNodes(nodes);
            setEdges(edges);
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
