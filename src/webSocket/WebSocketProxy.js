import { MessageQueue } from './messageQueue.js';
export class WebSocketProxy {
  // WebSocket关闭代码常量
  static CLOSE_CODES = {
    NORMAL: 1000,           // 正常关闭
    ABNORMAL: 1006,         // 异常关闭
    RECONNECT: 3000,        // 重新连接
    HEARTBEAT_TIMEOUT: 3001, // 心跳超时
    SEND_FAILED: 3002,      // 发送消息失败
    MANUAL_CLOSE: 3003,      // 手动关闭
  };
  constructor(url, options = {}) {
    this.url = url;
    this.option = {
      maxReconnectAttempts: 5,
      initialReconnectDelay: 2000,
      heartbeatInterval: 5000,
      // 心跳超时为心跳间隔的两倍+冗余时间
      // heartbeatTimeout: 60000 + 10000,
      heartbeatTimeout: 10000,
      ...options,
    };
    this.messageHandlers = {};
    this.socket = null;
    this.reconnectTimeoutId = null;
    this.heartbeatIntervalId = null;
    this.currentReconnectAttempt = 0;
    this.isConnected = false;
    this.isConnecting = false;
    this.lastPongTime = 0;
    this.messageQueue = new MessageQueue(url);
    this.connect();
  }
  // 连接
  connect() {
    if (this.socket?.readyState === 1) {
      console.log('状态为1');
      this.socket.close(WebSocketProxy.CLOSE_CODES.RECONNECT, '重新连接关闭');
    }
    this.isConnected = false;
    this.isConnecting = true;
    this.socket = new WebSocket(this.url);
    console.log('WebSocket连接中...');

    this.socket.onopen = () => {
      console.log('Websocket连接成功');
      this.isConnected = true;
      this.isConnecting = false;
      this.currentReconnectAttempt = 0;
      this.startHeartbeat();
      let message = this.messageQueue.dequeue();
      while (message) {
        // console.log('发送消息队列中的消息', message);
        message.operation.includeSender = true;
        this.sendMessage(message);
        message = this.messageQueue.dequeue();
      }
    };
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'pong') {
        this.lastPongTime = Date.now();
        return;
      }
      const { type, operation } = data;
      this.messageHandlers[type]?.(operation);
    };
    this.socket.onclose = (e) => {
      this.isConnected = false;
      console.log('WebSocket连接关闭', e);
      if (e.code === WebSocketProxy.CLOSE_CODES.ABNORMAL) {
        console.log('WebSocket异常关闭,忽略');
        return;
      }
      this.stopHeartbeat();

      // 根据关闭代码处理不同情况
      switch (e.code) {
        case WebSocketProxy.CLOSE_CODES.NORMAL:
          console.log('WebSocket正常关闭');
          break;
        case WebSocketProxy.CLOSE_CODES.MANUAL_CLOSE:
          console.log('WebSocket手动关闭');
          break;
        case WebSocketProxy.CLOSE_CODES.RECONNECT:
          console.log('WebSocket重新连接,关闭旧连接');
          break;
        case WebSocketProxy.CLOSE_CODES.ABNORMAL:
        case WebSocketProxy.CLOSE_CODES.HEARTBEAT_TIMEOUT:
        case WebSocketProxy.CLOSE_CODES.SEND_FAILED:
          console.log(`WebSocket关闭,代码: ${e.code}, 原因: ${e.reason}`);
          this.reconnect();
          break;
        default:
          // 未知关闭代码，尝试重连
          console.log(`WebSocket未知关闭代码: ${e.code}`);
          if (!e.wasClean) {
            this.reconnect();
          }
      }
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket连接错误', error);
      if (!this.isConnected)
        this.reconnect();
    };
  }
  // 重连
  reconnect() {
    console.log('WebSocket重连');
    this.isConnecting = true;
    this.stopHeartbeat();
    if (this.currentReconnectAttempt >= this.option.maxReconnectAttempts) {
      console.log('WebSocket达到最大重连次数，不再重连');
      this.close();
      return;
    }
    this.currentReconnectAttempt++;
    // 指数退避
    const delay = this.option.initialReconnectDelay * Math.pow(2, this.currentReconnectAttempt - 1);
    console.log(`WebSocket重连中，尝试次数${this.currentReconnectAttempt}, 延迟${delay}ms`);
    this.reconnectTimeoutId = setTimeout(() => {
      this.connect();
    }, delay);
  }

  // 启动心跳机制
  startHeartbeat() {
    this.stopHeartbeat();
    console.log('启动心跳机制');
    this.lastPongTime = Date.now();
    this.heartbeatIntervalId = setInterval(() => {
      // ??????
      // if (!this.isConnected)
      //   return;
      if (Date.now() - this.lastPongTime > this.option.heartbeatTimeout) {
        console.log('WebSocket心跳超时，触发重连');
        // 通过关闭WebSocket来触发重连
        if (this.socket?.readyState === 1)
          this.socket.close(WebSocketProxy.CLOSE_CODES.HEARTBEAT_TIMEOUT, '心跳超时关闭');
        this.reconnect();
        return;
      }
      if (this.socket?.readyState === 1)
        this.socket.send(JSON.stringify({ type: 'ping' }));
    }, this.option.heartbeatInterval);
  }
  // 停止心跳机制
  stopHeartbeat() {
    // console.log('停止心跳');
    clearInterval(this.heartbeatIntervalId);
  }
  // 注册消息处理器
  registerMessageHandler(type, handler) {
    if (typeof handler !== 'function')
      throw new Error('处理器必须是函数');
    this.messageHandlers[type] = handler;
  }
  unregisterMessageHandler(type) {
    delete this.messageHandlers[type];
  }
  sendMessage(message) {
    // message.operation.includeSender = false;
    // console.log('发送消息', message);
    if (!this.isConnected || this.socket?.readyState !== WebSocket.OPEN || !navigator.onLine) {
      console.error('WebSocket未连接，无法发送消息,消息存入localstorage');
      this.messageQueue.enqueue(message);
      if (!this.isConnecting)
        this.reconnect();
      return;
    }
    try {
      this.socket.send(JSON.stringify(message));
    } catch (error) {
      console.error('WebSocket发送消息失败', error);
      this.messageQueue.enqueue(message);
      if (this.socket?.readyState === 1)
        this.socket.close(WebSocketProxy.CLOSE_CODES.SEND_FAILED, '发送消息失败关闭');
      this.reconnect();
    }
  }
  // 断开连接
  close() {
    this.stopHeartbeat();
    if (this.reconnectTimeoutId)
      clearTimeout(this.reconnectTimeoutId);
    if (this.socket?.readyState === 1) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      console.log('关闭');
      this.socket.close(WebSocketProxy.CLOSE_CODES.MANUAL_CLOSE, '手动关闭');
      this.socket = null;
    }
  }
  /**
   * 添加边
   * @param {Object} edgeData - 边的数据对象
   * @param {string} edgeData.id - 边的唯一标识符
   */
  addEdge(edgeData) {
    const message = {
      type: 'addEdge',
      operation: { id: edgeData.id, value: `${JSON.stringify(edgeData)}` },
    };
    this.sendMessage(message);
  }
  /**
   * 删除边
   * @param {string} edgeId - 边的唯一标识符
   */
  deleteEdge(edgeId) {
    const message = {
      type: 'deleteEdge',
      operation: { id: edgeId },
    };
    this.sendMessage(message);
  }
  /**
   * 更新边
   * @param {string} edgeId - 边的唯一标识符
   * @param {Array<string>} path - 修改属性的路径数组
   * @param {*} updateData - 修改的属性的新值
   */
  updateEdge(edgeId, path, updateData, version) {
    const message = {
      type: 'updateEdge',
      operation: { id: edgeId, path, value: `${JSON.stringify(updateData)}`, version: version },
    };
    this.sendMessage(message);
  }
  /**
   * 添加节点
   * @param {Object} nodeData - 节点的数据对象
   * @param {string} nodeData.id - 节点的唯一标识符
   */
  addNode(nodeData) {
    const message = {
      type: 'addNode',
      operation: { id: nodeData.id, value: `${JSON.stringify(nodeData)}` },
    };
    this.sendMessage(message);
  }
  /**
   * 删除节点
   * @param {string} nodeId - 节点的唯一标识符
   */
  deleteNode(nodeId) {
    const message = {
      type: 'deleteNode',
      operation: { id: nodeId },
    };
    this.sendMessage(message);
  }
  /**
   * 更新节点
   * @param {string} nodeId - 节点的唯一标识符
   * @param {Array<string>} path - 修改属性的路径数组
   * @param {*} updateData - 修改的属性的新值
   */
  updateNode(nodeId, path, updateData, version) {
    const message = {
      type: 'updateNode',
      operation: { id: nodeId, path, value: `${JSON.stringify(updateData)}`, version: version },
    };
    this.sendMessage(message);
  }

}
