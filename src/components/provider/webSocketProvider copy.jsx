import { useReactFlow } from '@xyflow/react';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();

    const wsRef = useRef(null);

    const reconnectCountRef = useRef(0);
    const connectWebSocket = () => {
        const ws = new WebSocket("ws://localhost:3001");
        ws.onopen = () => {
            console.log('Connected to WebSocket server.');
        };

        ws.onmessage = (e) => {
            const { type, data } = JSON.parse(e.data);
            switch (type) {
                case "init":
                    const { nodes, edges } = data;
                    setNodes(nodes);
                    setEdges(edges);
                    break;
                case "pong":
                    console.log("Receive pong.");
                    break;
                default:
                    break;
            }
        };

        ws.onclose = (e) => {
            console.log('Disconnected from WebSocket server', e);
            if (!e.wasClean)
                setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    connectWebSocket();
                }, 5000);
        };
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            reconnectCountRef.current++;
        };
        wsRef.current = ws;

    }
    useEffect(() => {
        connectWebSocket()
        return () => {
            if (wsRef.current)
            wsRef.current.close();
        }
    }, []);

    const send = ((message) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
        else {

            console.log("WebSocket is not open.");
        }
    })

    const updateEdge = (id, updateData) => {
        const message = { type: 'update-edge', data: { id, updateData } }
        send(message)
    }
    const updateNode = (id, updateData) => {
        const message = { type: 'update-node', data: { id, updateData } }
        send(message)
    }
    const ws = {
        updateNode: updateNode,
        updateEdge: updateEdge,
    }
    const ret = [ws]
    return (
        <WebSocketContext.Provider value={ret}>
            {children}
            <button onClick={() => {
                wsRef.current.close()
            }}>close</button>
            <button onClick={() => {
                connectWebSocket()
            }}>reconnect</button>
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};