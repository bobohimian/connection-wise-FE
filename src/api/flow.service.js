import apiClient from './apiClient.js';

// 获取 nodes 和 edges  的函数
export const fetchCanvasList = async (userId) => {
    try {
        const resData = await apiClient.get('/canvas/user/'+userId);
        return resData;
    } catch (error) {
        console.error('Error fetching flow nodes:', error);
        throw error;
    }
};
export const fetchCanvas = async (canvasId) => {
    try {
        const resData = await apiClient.get('/canvas/'+canvasId);
        return resData;
    } catch (error) {
        console.error('Error fetching flow nodes:', error);
        throw error;
    }
}
