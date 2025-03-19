// src/WebSocketService.js
class WebSocketManager {
    constructor() {
        this.connection = {};
    }

    connect(url) {
        const connections = this.connection;
        if (connections.hasOwenProperty(url))
            return connections[url];
        const ws= new WebSocket(this.url);

        connections.onopen = () => {
            console.log("WebSocket connected");
        };

        connections.onmessage = (message) => {
            console.log
        };

        connections.onclose = () => {
            console.log("WebSocket disconnected");
        };

        connections.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };
    }

    sendMessage(message) {
        const connections = this.connection;
        if (connections && connections.readyState === WebSocket.OPEN) {
            connections.send(message);
        } else {
            console.error("WebSocket is not connected.");
        }
    }
}

export default WebSocketManager;