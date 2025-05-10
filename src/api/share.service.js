import apiClient from './apiClient.js';

export const fetchSharedCanvasList = async (userId) => {
    try {
        const resData = await apiClient.get('/share/user/' + userId);
        return resData;
    }
    catch (error) {
        console.error('Error getting shared canvas', error);
        throw error;
    }
}
export const fetchSharedUserList=async(canvasId)=>{
    try {
        const resData = await apiClient.get('/share/' + canvasId);
        return resData;
    }
    catch (error) {
        console.error('Error getting shared user', error);
        throw error;
    }
}
export const shareCanvas=async(shareCanvas)=>{
    try {
        const resData = await apiClient.post('/share',shareCanvas);
        return resData;
    }
    catch (error) {
        console.error('Error sharing canvas', error);
        throw error;
    }
}
export const deleteShare=async(shareId)=>{
    try {
        const resData = await apiClient.delete('/share/'+shareId);
        return resData;
    }
    catch (error) {
        console.error('Error deleting share', error);
        throw error;
    }
}
export const updateShare=async(shareCanvas)=>{
    try {
        const resData = await apiClient.put('/share',shareCanvas);
        return resData;
    }
    catch (error) {
        console.error('Error updating share', error);
        throw error;
    }
}