import apiClient from "./apiClient";

export const generateGraph = async (prompt, abortSignal = null) => {
    try {
        // 创建配置对象，设置更长的超时时间（60秒）
        const config = {
            timeout: 60000, // 将超时时间设置为60秒，比默认的10秒更长
        };
        
        // 如果提供了中止信号，添加到请求配置中
        if (abortSignal) {
            config.signal = abortSignal;
        }
        
        const resData = await apiClient.get('/ai/generate-graph-str?prompt='+prompt, config);
        return resData;
    }
    catch (error) {
        // 如果是请求被取消的错误，提供更友好的错误信息
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
            console.log('Graph generation was canceled');
            throw new Error('请求已被取消');
        }
        console.error('Error generating graph', error);
        throw error;
    }
}