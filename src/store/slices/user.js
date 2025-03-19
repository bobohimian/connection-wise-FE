import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isLoggedIn: false,
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
    setUserStatus: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload
      };
    },
    clearUserInfo: (state) => {
      state.isLoggedIn = false;
      state.userInfo = initialState.userInfo;
    }
  }
});

export const { setUserStatus, setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
