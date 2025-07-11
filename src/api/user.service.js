import apiClient from './apiClient.js';
export const login = async (username, password) => {
  try {
    const resposne =
            await apiClient.post('/user/login',
              {
                username: username,
                password: password,
              },
            );
    return resposne;
  } catch (error) {
    console.log('Error logging in:', error);
    throw error;
  }
};
export const logout = async () => {
  try {
    const resposne =
            await apiClient.post('/user/logout');
    return resposne;
  } catch (error) {
    console.log('Error logging out:', error);
    throw error;
  }
};
export const checkSession = async () => {
  try {
    const resposne =
            await apiClient.post('/user/check-auth');
    return resposne;
  } catch (error) {
    console.log('Error checking session:', error);
    throw error;
  }
};
export const register = async (username, password, email) => {
  try {
    const resposne =
            await apiClient.post('/user/register',
              {
                username: username,
                password: password,
                email: email,
              },
            );
    return resposne;
  } catch (error) {
    console.log('Error registering user:', error);
    throw error;
  }
};
export const getUserByUserName = async (username) => {
  try {
    const resposne =
            await apiClient.get('/user/search?username=' + username);
    return resposne;
  } catch (error) {
    console.log('Error getting user by username:', error);
    throw error;
  }
};
