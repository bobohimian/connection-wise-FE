import { useEffect } from 'react';
import { useEnhancedReactFlow } from '../../hooks/useEnhancedReactFlow.js';
import { useWSProxy } from '../../hooks/usewsProxy.js';

const WebSocketProvider = ({ children }) => {
  const { wsProxy, removeWSProxy } = useWSProxy();
  const { addNode, deleteNode, updateNode, addEdge, deleteEdge, updateEdge } = useEnhancedReactFlow();

  useEffect(() => {
    const options = {
      userws: false,
    };
    const messageHandlers = {
      addNode: (operation) => {
        const { value } = operation;
        const node = JSON.parse(value);
        addNode(node, options);
      },
      deleteNode: (operation) => {
        const { id } = operation;
        deleteNode(id, options);
      },
      updateNode: (operation) => {
        const { id, path, value } = operation;
        updateNode(id, path, JSON.parse(value), options);
      },
      addEdge: (operation) => {
        const { value } = operation;
        const edge = JSON.parse(value);
        addEdge(edge, options);
      },
      deleteEdge: (operation) => {
        const { id } = operation;
        deleteEdge(id, options);
      },
      updateEdge: (operation) => {
        const { id, path, value } = operation;
        updateEdge(id, path, JSON.parse(value), options);
      },
      pong: () => {
        console.log('Receive pong.');
      },
    };
    for (const [type, handler] of Object.entries(messageHandlers)) {
      wsProxy.registerMessageHandler(type, handler);
    }
    return () => {
      if (wsProxy)
        removeWSProxy();
    };
  }, [addEdge, addNode, deleteEdge, deleteNode, updateEdge, updateNode, removeWSProxy, wsProxy]);
  return children;
};
export default WebSocketProvider;