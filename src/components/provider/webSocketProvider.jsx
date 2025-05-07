import React, { useEffect } from 'react';
// import { messageHandlers } from '../../webSocket/messageHandlers.js';
import { usewsProxy } from '../../hooks/usewsProxy.js';
import { useEnhancedReaceFlow } from '../../hooks/useEnhancedReaceFlow.js';

const WebSocketProvider = ({ children }) => {
    const { wsProxy } = usewsProxy();
    const {addNode,deleteNode,updateNode,addEdge,deleteEdge,updateEdge}=useEnhancedReaceFlow();
    const option={
        userws:false
    }
    const messageHandlers = {
        addNode:(operation)=>{
            const {value}=operation;
            const node=JSON.parse(value);
            addNode(node,option);
        },
        deleteNode:(operation)=>{
            const {id}=operation;
            deleteNode(id,option);
        },
        updateNode:(operation)=>{
            const {id,path,value}=operation;
            updateNode(id,path,JSON.parse(value),option);
        },
        addEdge:(operation)=>{
            const {value}=operation;
            const edge=JSON.parse(value);
            addEdge(edge,option);
        },
        deleteEdge:(operation)=>{
            const {id}=operation;
            deleteEdge(id,option);
        },
        updateEdge:(operation)=>{
            const {id,path,value}=operation;
            updateEdge(id,path,JSON.parse(value),option);
        },
        pong: () => {
            console.log("Receive pong.");
        }
    }
    useEffect(() => {
        for (const [type, handler] of Object.entries(messageHandlers)) {
            wsProxy.registerMessageHandler(type, handler);
        }
    })

    return (children);
};
export default WebSocketProvider;