import { configureStore } from '@reduxjs/toolkit';
import canvasRecuder from './slices/canvas.js';
import settingReducer from './slices/setting.js';
import uiReducer from './slices/ui.js';
import userReducer from './slices/user.js';
const store = configureStore({
  reducer: {
    user: userReducer,
    setting: settingReducer,
    ui: uiReducer,
    canvas: canvasRecuder,
  },
  // 添加Redux DevTools扩展支持
  devTools: process.env.NODE_ENV !== 'production',
  // 解决非序列化值的警告
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({

    }),
});
// 暴露到 window（仅开发/测试环境，生产环境移除）
if (process.env.NODE_ENV !== 'production') {
  window.store = store; // 关键！测试时通过 window 访问
}
export default store;