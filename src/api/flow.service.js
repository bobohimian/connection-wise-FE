import apiClient from './apiClient.js';

// 获取 nodes 和 edges  的函数
export const getFlowData = async () => {
    try {
        const response = await apiClient.get('/flow');
        return response.data;
    } catch (error) {
        console.error('Error fetching flow nodes:', error);
        throw error;
    }
};

export const getFlowNodes = async () => {
    try {
        const response = await apiClient.get('/flow/nodes');
        return response.data;
    } catch (error) {
        console.error('Error fetching flow nodes:', error);
        throw error;
    }
};
export const getFlowEdges = async () => {
    try {
        const response = await apiClient.get('/flow/edges');
        return response.data;
    } catch (error) {
        console.error('Error fetching flow nodes:', error);
        throw error;
    }
};
