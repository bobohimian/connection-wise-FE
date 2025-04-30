import { WebSocketProxy } from './WebSocketProxy.js';
class WebSocketManager {
    constructor() {
        this.connections = {};
    }
    getwsProxy(url) {
        if (this.connections.hasOwnProperty(url))
            return this.connections[url];
        this.connections[url] = new WebSocketProxy(url);
        return this.connections[url];
    }
}
export const webSocketManager = new WebSocketManager();

