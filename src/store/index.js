import { configureStore } from '@reduxjs/toolkit';
import settingReducer from './slices/setting.js';
import uiReducer from './slices/ui.js';
import userReducer from './slices/user.js';
const store = configureStore({
  reducer: {
    user: userReducer,
    setting: settingReducer,
    ui: uiReducer,
  },
  // 添加Redux DevTools扩展支持
  devTools: process.env.NODE_ENV !== 'production',
  // 解决非序列化值的警告
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({

    }),
});
export default store;