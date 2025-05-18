import { webSocketManager } from "../webSocket/webSocketManager";
import { useParams } from "react-router-dom";
export const usewsProxy = (url) => {
    const canvasId = useParams().canvasId;
    url = url ? url : `${process.env.WS_BASE_URL}/canvas/${canvasId}`;
    const wsProxy = webSocketManager.getwsProxy(url);
    return { wsProxy }
};