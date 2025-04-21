import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../api";
const initialState = {
  isAuthenticated: false,
  loading: false,
  userInfo: {
    id:null,
    username: '',
    email: '',
    avatar: '',
  },
  canvasId:1
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
