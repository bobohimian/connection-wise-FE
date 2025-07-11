import { useParams } from 'react-router-dom';
import { webSocketManager } from '../webSocket/webSocketManager';
export const useWsProxy = (initialUrl) => {
  const canvasId = useParams().canvasId;
  const url = initialUrl ? initialUrl : `${process.env.WS_BASE_URL}/canvas/${canvasId}`;
  const wsProxy = webSocketManager.getWsProxy(url);
  return { wsProxy };
};