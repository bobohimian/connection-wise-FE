class WebSocketProxy {
    constructor(url) {
        this.url = url;
        this.messageHandlers = {};
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            console.log('Connected to WebSocket server.');
        };

        this.socket.onmessage = (e) => {
            const responseData = JSON.parse(e.data);
            const { type, data } = responseData;
            this.messageHandlers[type] && this.messageHandlers[type](data);
        };

        this.socket.onclose = (e) => {
            console.log('Disconnected from WebSocket server', e);
            if (!e.wasClean)
                setTimeout(() => {
                    console.log('Attempting to reconnect...');
                }, 5000);
        };
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
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
    addEdge(canvasId,edgeData) {
        const message = {
            type: "add-edge",
            opertation: {canvasId,value:`${JSON.stringify(edgeData)}`}
        }
        this.sendMessage(message);
    }
    deleteEdge(canvasId,edgeId) {
        const message = {
            type: "delete-edge",
            opertation: {canvasId,jsonObjId:edgeId}
        }
        this.sendMessage(message);
    }
    updateEdge(canvasId,edgeId,path, updateData) {
        const message = {
            type: "update-edge",
            opertation: {canvasId,jsonObjId:edgeId, path, value:`${JSON.stringify(updateData)}` }
        }
        this.sendMessage(message);
    }
    addNode(canvasId,nodeData) {
        console.log(nodeData)
        const message = {
            type: "add-node",
            opertation: {canvasId,value:`${JSON.stringify(nodeData)}`}
        }
        this.sendMessage(message);
    }
    deleteNode(canvasId,nodeId) {
        const message = {
            type: "delete-node",
            opertation: {canvasId,jsonObjId:nodeId}
        }
        this.sendMessage(message);
    }
    updateNode(canvasId,nodeId,path, updateData) {
        const message = {
            type: "update-node",
            opertation: {canvasId,jsonObjId:nodeId, path, value:`${JSON.stringify(updateData)}` }
        }
        this.sendMessage(message);
    }
}
export default WebSocketProxy;