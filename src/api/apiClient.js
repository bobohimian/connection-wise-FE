import axios from 'axios';

/**
 * 自定义错误类，用于表示API返回的错误
 * axios拦截器会构建ApiError对象，并抛出，在组件中的catch中可以捕获到该错误，不需要在try块中处理，将错误处理与正确响应的处理分离
 * catch块中，通过error.isApi区分是业务错误还是其他错误,使用if else 语句分别进行处理
 * @class ApiError
 * 
 */
class ApiError extends Error {
  constructor(response) {
    const apiResponse = response.data;
    super(apiResponse.msg||'API请求失败');
    this.name = 'ApiError';
    this.response = apiResponse;
    this.isApi = true;
    this.stack = `${this.name}: ${this.message}\n` +
            `    at ${response.config.method.toUpperCase()} ${response.config.url}\n`;
  }
}


const apiClient = axios.create({
  // baseURL: 'http://localhost:3000/api',
  baseURL: `${process.env.API_BASE_URL}`,

  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(config => config, error => Promise.reject(error));

// 响应拦截器
apiClient.interceptors.response.use(response => {
  const apiResponse = response.data;
  if (!apiResponse.ok) {
    const error = new ApiError(response);
    return Promise.reject(error);
  }
  return apiResponse;
}, error => {
  const status = error.response.status;
  if (status === 401) {
    location.href = '/login';
  }
  console.error('API Error:', error);
  return Promise.reject(error);
});

export default apiClient;