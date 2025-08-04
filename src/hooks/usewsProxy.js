import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { webSocketManager } from '../webSocket/webSocketManager';
export const useWSProxy = (initialUrl) => {
  const canvasId = useParams().canvasId;
  const url = initialUrl ? initialUrl : `${process.env.WS_BASE_URL}/canvas/${canvasId}`;
  const wsProxy = webSocketManager.buildWSProxy(url);
  const removeWSProxy = useCallback(() => {
    webSocketManager.clearWSProxy(url);
  }, [url]);
  return { wsProxy, removeWSProxy };
};