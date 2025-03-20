class WebSocketProxy {
    constructor(url) {
        this.url = url;
        this.messageHandlers = {};
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            console.log('Connected to WebSocket server.');
        };

        this.socket.onmessage = (e) => {
            const { type, data } = JSON.parse(e.data);
            this.messageHandlers[type] && this.messageHandlers[type](data);
        };

        this.socket.onclose = (e) => {
            console.log('Disconnected from WebSocket server', e);
            if (!e.wasClean)
                setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    connectWebSocket();
                }, 5000);
        };
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            reconnectCountRef.current++;
        };
    }
    registerMessageHandler(type, handler) {
        if (typeof handler !== 'function')
            throw new Error('Handler must be a function');
        this.messageHandlers[type] = handler;
    }
    unregisterMessageHandler(type) {
        delete this.messageHandlers[type];
    }
    sendMessage(message) {
        this.socket.send(JSON.stringify(message));
    }
    updateEdge(id, updateData) {
        const message = {
            type: "update-edge",
            data: { id, updateData }
        }
        this.sendMessage(message);
    }
    updateNode(id, updateData) {
        const message = {
            type: "update-node",
            data: { id, updateData }
        }
        this.sendMessage(message);
    }
}
export default WebSocketProxy;