import apiClient from './apiClient.js';

// 获取 nodes 和 edges  的函数
export const fetchCanvasList = async (userId) => {
  try {
    const response = await apiClient.get('/canvas/user/' + userId);
    return response;
  } catch (error) {
    console.error('Error fetching canvaslist', error);
    throw error;
  }
};
export const fetchCanvas = async (canvasId) => {
  try {
    const response = await apiClient.get('/canvas/' + canvasId);
    return response;
  } catch (error) {
    console.error('Error fetching canvas', error);
    throw error;
  }
};
export const createCanvas = async (userId) => {
  try {
    const response = await apiClient.post('/canvas/create/' + userId);
    return response;
  }
  catch (error) {
    console.error('Error creating canvas', error);
    throw error;
  }
};
export const updateCanvas = async (canvasData) => {
  try {
    const response = await apiClient.put('/canvas', canvasData);
    return response;
  }
  catch (error) {
    console.error('Error updating canvas', error);
    throw error;
  }
};
export const deleteCanvas = async (canvasId) => {
  try {
    const response = await apiClient.delete('/canvas/' + canvasId);
    return response;
  }
  catch (error) {
    console.error('Error deleting canvas', error);
    throw error;
  }
};

export const uploadThumbnail = async (formData) => {
  try {
    const response = await apiClient.post(
      '/canvas/uploadThumbnail',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response;
  }
  catch (error) {
    console.error('Error uploading thumbnail', error);
    throw error;
  }
};
export const requestToConnect = async (canvasId) => {
  try {
    const response = await apiClient.get(
      '/canvas/connection',
      {
        params: { canvasId },
      },
    );
    return response;
  }
  catch (error) {
    console.error('Error requesting to connect', error);
    throw error;
  }
};