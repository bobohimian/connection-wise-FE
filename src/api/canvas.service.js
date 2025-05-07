import apiClient from './apiClient.js';

// 获取 nodes 和 edges  的函数
export const fetchCanvasList = async (userId) => {
    try {
        const resData = await apiClient.get('/canvas/user/' + userId);
        return resData;
    } catch (error) {
        console.error('Error fetching canvaslist', error);
        throw error;
    }
};
export const fetchCanvas = async (canvasId) => {
    try {
        const resData = await apiClient.get('/canvas/' + canvasId);
        return resData;
    } catch (error) {
        console.error('Error fetching canvas', error);
        throw error;
    }
}
export const createCanvas = async (userId) => {
    try {
        const resData = await apiClient.post('/canvas/create/' + userId);
        return resData;
    }
    catch (error) {
        console.error('Error creating canvas', error);
        throw error;
    }
}
export const updateCanvas = async (canvasData) => {
    try {
        const resData = await apiClient.put('/canvas', canvasData);
        return resData;
    }
    catch (error) {
        console.error('Error updating canvas', error);
        throw error;
    }
}
export const deleteCanvas = async (canvasId) => {
    try {
        const resData = await apiClient.delete('/canvas' + canvasId);
        return resData;
    }
    catch (error) {
        console.error('Error deleting canvas', error);
        throw error;
    }
}