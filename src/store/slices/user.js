import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../api";
const initialState = {
  isAuthenticated: false,
  loading: false,
  canvasId:null,
  userInfo: {
    id:null,
    username: '',
    email: '',
    avatar: '',
  },
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
    setCanvasId:(state,action)=>{
      state.canvasId = action.payload;
    },
    clearUserInfo: (state) => {
      state.isAuthenticated = false;
      state.userInfo = initialState.userInfo;
    }
  }
});
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUser = (state) => state.user;  

export const selectUserId = (state) => state.user.userInfo.id;
export const { setAuthenticated,setCanvasId, setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
