import axios from 'axios';

const apiClient = axios.create({
    // baseURL: 'http://localhost:3000/api',
    baseURL: `${process.env.API_BASE_URL}/api`,

    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
apiClient.interceptors.request.use(config => {
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
apiClient.interceptors.response.use(response => {
    return response.data;
}, error => {
    const status = error.response.status;
    console.error('API Error:', error);
    return Promise.reject(error);
});

export default apiClient;