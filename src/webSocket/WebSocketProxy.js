export class WebSocketProxy {
  constructor(url) {
    this.url = url;
    this.messageHandlers = {};
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      console.log('Connected to WebSocket server.');
    };

    this.socket.onmessage = (e) => {
      const responseData = JSON.parse(e.data);
      const { type, operation } = responseData;
      this.messageHandlers[type] && this.messageHandlers[type](operation);
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
  addEdge(edgeData) {
    const message = {
      type: 'addEdge',
      operation: { id:edgeData.id,  value: `${JSON.stringify(edgeData)}` },
    };
    this.sendMessage(message);
  }
  deleteEdge(edgeId) {
    const message = {
      type: 'deleteEdge',
      operation: { id: edgeId },
    };
    this.sendMessage(message);
  }
  updateEdge(edgeId, path, updateData) {
    const message = {
      type: 'updateEdge',
      operation: { id: edgeId, path, value: `${JSON.stringify(updateData)}` },
    };
    this.sendMessage(message);
  }
  addNode(nodeData) {
    const message = {
      type: 'addNode',
      operation: { id:nodeData.id, value: `${JSON.stringify(nodeData)}` },
    };
    this.sendMessage(message);
  }
  deleteNode(nodeId) {
    const message = {
      type: 'deleteNode',
      operation: { id: nodeId },
    };
    this.sendMessage(message);
  }
  updateNode(nodeId, path, updateData) {
    const message = {
      type: 'updateNode',
      operation: { id: nodeId, path, value: `${JSON.stringify(updateData)}` },
    };
    this.sendMessage(message);
  }

}
