import { webSocketManager } from "../webSocket/webSocketManager";
import { useParams } from "react-router-dom";

export const usewsProxy = (url) => {
    const canvasId = useParams().canvasId;
    url = url ? url : `ws://localhost:8080/api/ws/canvas/${canvasId}`
    const wsProxy = webSocketManager.getwsProxy(url);
    return { wsProxy }
}
