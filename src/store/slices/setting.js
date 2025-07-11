import { createSlice } from '@reduxjs/toolkit'; 
const initialState = {
  theme: 'light',
  language: 'en',
};
const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      console.log(action.payload);
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});
export const selectTheme = (state) => state.setting.theme;
export const { setTheme, setLanguage } = settingSlice.actions;
export default settingSlice.reducer;