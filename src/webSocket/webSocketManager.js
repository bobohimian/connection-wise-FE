import { WebSocketProxy } from './WebSocketProxy.js';
class WebSocketManager {
  constructor() {
    this.connections = {};
  }
  get(url) {
    return this.connections[url] || null;
  }
  buildWSProxy(url) {
    if (this.connections.hasOwnProperty(url)) {
      return this.connections[url];
    }
    for (const url in this.connections) {
      this.connections[url].close();
      delete this.connections[url];
    }
    this.connections[url] = new WebSocketProxy(url);
    return this.connections[url];
  }
  clearWSProxy() {
    for (const url in this.connections) {
      this.connections[url].close();
      delete this.connections[url];
    }
  }
}
export const webSocketManager = new WebSocketManager();

