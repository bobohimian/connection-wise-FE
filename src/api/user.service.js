import apiClient from './apiClient.js';
export const login = async (username, password) => {
    try {
        const responseData =
            await apiClient.post('/user/login',
                {
                    username: username,
                    password: password
                }
            );
        return responseData
    } catch (error) {
        throw error;
    }
};
export const logout = async () => {
    try {
        const responseData =
            await apiClient.post('/user/logout');
        return responseData;
    } catch (error) {
        throw error;
    }
};
export const checkSession = async () => {
    try {
        const responseData =
            await apiClient.post('/user/check-auth');
        return responseData;
    } catch (error) {
        throw error;
    }
};
export const register = async (username, password, email) => {
    try {
        const responseData =
            await apiClient.post('/user/register',
                {
                    username: username,
                    password: password,
                    email: email
                }
            );
        return responseData;
    } catch (error) {
        throw error;
    }
};