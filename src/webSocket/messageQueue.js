import { messageStorageUtil } from '../utils/localstorageUtil';
class MessageQueue {
    /**
     * @param {LocalStorage} storageUtil
     * @param {string} queueKey
     */
    constructor(queueKey, storageUtil = messageStorageUtil) {
        if (queueKey === undefined) {
            throw new Error('queueKey 不能为空');
        }
        this.storageUtil = storageUtil;
        this.queueKey = queueKey;
    }

    /**
     * @param {any} message 要存储的消息
     * @returns {boolean}   操作结果
     */
    enqueue(message) {
        try {
            const currentQueue = this.#getCurrentQueue();
            currentQueue.push(message);
            this.storageUtil.setItem(this.queueKey, currentQueue);
            return true;
        } catch (error) {
            console.error(`消息入队失败，键名：${this.queueKey}，错误：`, error);
            return false;
        }
    }

    /**
     * 从队列头部取出消息（出队）
     * @returns {any|null} 取出的消息
     */
    dequeue() {
        try {
            const currentQueue = this.#getCurrentQueue();
            if (currentQueue.length === 0) return null;
            const message = currentQueue.shift();
            this.storageUtil.setItem(this.queueKey, currentQueue);
            return message;
        } catch (error) {
            console.error(`消息出队失败，键名：${this.queueKey}，错误：`, error);
            return null;
        }
    }

    /**
     * 获取当前队列的所有消息
     * @returns {any[]} 消息结果，无消息返回空数组
     */
    getQueue() {
        try {
            return [...this.#getCurrentQueue()]; // 返回副本避免直接修改内部状态
        } catch (error) {
            console.error(`获取队列失败，键名：${this.queueKey}，错误：`, error);
            return [];
        }
    }

    /**
     * 清空队列
     */
    clear() {
        try {
            this.storageUtil.removeItem(this.queueKey);
        } catch (error) {
            console.error(`清空队列失败，键名：${this.queueKey}，错误：`, error);
        }
    }

    /**
     * 获取当前队列的原始数据（内部使用）
     * @returns {any[]} 当前队列数组（可能为空）
     */
    #getCurrentQueue() {
        try {
            const messageData = this.storageUtil.getItem(this.queueKey);
            return Array.isArray(messageData) ? messageData : []; // 确保数据是数组
        } catch (error) {
            console.error(`解析队列数据失败（可能数据损坏），键名：${this.queueKey}，错误：`, error);
            this.storageUtil.removeItem(this.queueKey); // 数据损坏时自动清理
            return [];
        }
    }
}
export { MessageQueue };