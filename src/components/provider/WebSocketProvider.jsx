import React, { useEffect } from 'react';
// import { messageHandlers } from '../../webSocket/messageHandlers.js';
import { usewsProxy } from '../../hooks/usewsProxy.js';
import { useEnhancedReaceFlow } from '../../hooks/useEnhancedReaceFlow.js';

const WebSocketProvider = ({ children }) => {
    const { wsProxy } = usewsProxy();
    const {addNode,deleteNode,updateNode,addEdge,deleteEdge,updateEdge}=useEnhancedReaceFlow();
    const options={
        userws:false
    }
    const messageHandlers = {
        addNode:(operation)=>{
            const {value}=operation;
            const node=JSON.parse(value);
            addNode(node,options);
        },
        deleteNode:(operation)=>{
            const {id}=operation;
            deleteNode(id,options);
        },
        updateNode:(operation)=>{
            const {id,path,value}=operation;
            updateNode(id,path,JSON.parse(value),options);
        },
        addEdge:(operation)=>{
            const {value}=operation;
            const edge=JSON.parse(value);
            addEdge(edge,options);
        },
        deleteEdge:(operation)=>{
            const {id}=operation;
            deleteEdge(id,options);
        },
        updateEdge:(operation)=>{
            const {id,path,value}=operation;
            updateEdge(id,path,JSON.parse(value),options);
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

    return children;
};
export default WebSocketProvider;
