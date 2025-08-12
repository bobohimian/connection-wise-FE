import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  isAuthenticated: false,
  loading: false,
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
    clearUserInfo: (state) => {
      state.userInfo = initialState.userInfo;
      state.isAuthenticated = false;
      state.loading = false;

    },
  },
});
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUser = (state) => state.user;
export const selectUserId = (state) => state.user.userInfo.id;
export const { setAuthenticated, setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
