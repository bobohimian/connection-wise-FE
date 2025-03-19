import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import settingReducer from "./slices/setting";
import uiReducer from "./slices/ui";
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