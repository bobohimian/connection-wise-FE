import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isAuthenticated: false,
  userInfo: {
    username: '',
    email: '',
    avatar: '',
    token: ''
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload
      };
    },
    clearUserInfo: (state) => {
      state.isAuthenticated = false;
      state.userInfo = initialState.userInfo;
    }
  }
});
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUser = (state) => state.user;  
export const { setAuthenticated, setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
