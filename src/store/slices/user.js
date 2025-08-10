import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  isAuthenticated: false,
  loading: false,
  canvasId: null,
  permission: '',
  userInfo: {
    id: null,
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
        ...action.payload,
      };
    },
    setCanvasId: (state, action) => {
      state.canvasId = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = initialState.userInfo;
      state.isAuthenticated = false;
      state.permission = '';
      state.canvasId = null;
      state.loading = false;

    },
    setPermission: (state, action) => {
      state.permission = action.payload;
    },
  },
});
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUser = (state) => state.user;
export const selectUserId = (state) => state.user.userInfo.id;
export const { setAuthenticated, setCanvasId, setUserInfo, clearUserInfo, setPermission } = userSlice.actions;
export default userSlice.reducer;
