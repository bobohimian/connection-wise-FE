class LocalStorage {
    /**
     * 构造函数
     * @param {string} namespace 命名空间前缀（可选）
     * @param {number} defaultExpires 默认过期时间（毫秒，可选，默认永久）
     */
    constructor(namespace = '', defaultExpires = null) {
        this.namespace = namespace;
        this.defaultExpires = defaultExpires;
        // 检测是否支持 localStorage
        if (!window.localStorage) {
            throw new Error('当前浏览器不支持 localStorage');
        }
    }

    /**
     * 生成带命名空间的键名
     * @param {string} key 原始键名
     * @returns {string} 带前缀的键名
     */
    #getKey(key) {
        return `${this.namespace}_${key}`;
    }

    /**
     * 序列化数据并存储
     * @param {string} key 键名
     * @param {any} value 存储值（支持对象/数组/字符串等）
     * @param {number} expires 过期时间（毫秒，可选）
     */
    setItem(key, value, expires = this.defaultExpires) {
        try {
            const storageKey = this.#getKey(key);
            const data = {
                value: value,
                expires: expires ? Date.now() + expires : null,
            };
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
            console.error(`localStorage setItem 失败，键名：${key}，错误：`, error);
            // 可选：降级到内存缓存或其他方案
        }
    }

    /**
     * 获取存储的值（自动处理过期和反序列化）
     * @param {string} key 键名
     * @returns {any|null} 存储值（过期或不存在返回 null）
     */
    getItem(key) {
        try {
            const storageKey = this.#getKey(key);
            const dataStr = localStorage.getItem(storageKey);
            if (!dataStr) return null;

            const data = JSON.parse(dataStr);
            // 检查是否过期
            if (data.expires && Date.now() > data.expires) {
                this.removeItem(key); // 过期则删除
                return null;
            }
            return data.value;
        } catch (error) {
            console.error(`localStorage getItem 失败，键名：${key}，错误：`, error);
            return null; // 解析失败（如数据被篡改）返回 null
        }
    }

    /**
     * 删除指定键
     * @param {string} key 键名
     */
    removeItem(key) {
        try {
            const storageKey = this.#getKey(key);
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error(`localStorage removeItem 失败，键名：${key}，错误：`, error);
        }
    }

    /**
     * 清空当前命名空间下的所有数据
     */
    clear() {
        try {
            const keysToRemove = [];
            // 遍历所有键，筛选出当前命名空间的键
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.namespace + '_')) {
                    keysToRemove.push(key);
                }
            }
            // 批量删除
            keysToRemove.forEach((key) => localStorage.removeItem(key));
        } catch (error) {
            console.error('localStorage clear 失败，错误：', error);
        }
    }
}
const messageStorageUtil = new LocalStorage('ws_msg', 1000 * 60 * 60);
export {
    messageStorageUtil,
};
