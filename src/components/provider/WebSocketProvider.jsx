import { createContext, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../api/index.js';
import { useEnhancedReactFlowForRemote } from '../../hooks/useEnhancedReactFlowForRemote.js';
import { setCanvas } from '../../store/slices/canvas.js';
import { WebSocketProxy } from '../../webSocket/WebSocketProxy.js';
const WebSocketContext = createContext(null);
const WebSocketProvider = ({ children }) => {
  const canvasId = useParams().canvasId;
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [wsProxy, setWsProxy] = useState(null);
  const wsProxyRef = useRef();
  const { addNode, deleteNode, updateNode, addEdge, deleteEdge, updateEdge, flushNode, flushEdge } = useEnhancedReactFlowForRemote();
  useEffect(() => {
    const init = async () => {
      try {
        const canvasData = (await apiService.fetchCanvas(canvasId)).data;
        dispatch(setCanvas(canvasData));
        await apiService.requestToConnect(canvasId);
        const url = `${process.env.WS_BASE_URL}/canvas/${canvasId}`;
        const wsProxy = new WebSocketProxy(url);
        const messageHandlers = {
          addNode: (operation) => {
            const { value } = operation;
            const node = JSON.parse(value);
            addNode(node);
          },
          deleteNode: (operation) => {
            const { id } = operation;
            deleteNode(id);
          },
          updateNode: (operation) => {
            const { id, path, value } = operation;
            updateNode(id, path, JSON.parse(value));
          },
          addEdge: (operation) => {
            const { value } = operation;
            const edge = JSON.parse(value);
            addEdge(edge);
          },
          deleteEdge: (operation) => {
            const { id } = operation;
            deleteEdge(id);
          },
          updateEdge: (operation) => {
            const { id, path, value } = operation;
            updateEdge(id, path, JSON.parse(value));
          },
          flushNode: (operation) => {
            const { id, value } = operation;
            const node = JSON.parse(value);
            flushNode(id, node);
          },
          flushEdge: (operation) => {
            const { id, value } = operation;
            const edge = JSON.parse(value);
            flushEdge(id, edge);
          },
          pong: () => {
            console.log('Receive pong.');
          },
        };
        for (const [type, handler] of Object.entries(messageHandlers)) {
          wsProxy.registerMessageHandler(type, handler);
        }
        setWsProxy(wsProxy);
        wsProxyRef.current = wsProxy;
      } catch (error) {
        if (error.isApi) {
          if (error.code === 3006) {
            console.log('获取画布失败');
          }
          else if (error.code === 5007)
            console.log('服务器繁忙，连接数达到上限');
          else if (error.code === 5008)
            console.log('房间任务已慢');
        } else {
          console.error(error);
        }
        navigator('/canvas');
      }
    };
    init();
    return () => {
      if (wsProxyRef.current) {
        wsProxyRef.current.close();
        setWsProxy(null);
      }
    };
  }, [addEdge, addNode, canvasId, deleteEdge, deleteNode, dispatch, flushEdge, flushNode, navigator, updateEdge, updateNode]);
  return (
    <WebSocketContext.Provider value={{ wsProxy }}>
      {children}
    </WebSocketContext.Provider>
  );
};
export { WebSocketContext };
export default WebSocketProvider;
