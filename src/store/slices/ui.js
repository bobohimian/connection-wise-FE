import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  activeDropdownId: '',
};
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveDropdownId: (state, action) => {
      state.activeDropdownId = action.payload;
    },
    clearActiveDropdownId: (state) => {
      state.activeDropdownId = '';
    },
    toggleActiveDropdownId: (state, action) => {
      if (state.activeDropdownId === action.payload) {
        state.activeDropdownId = '';
      } else {
        state.activeDropdownId = action.payload;
      }
    },
  },
});
export const selectActiveDropdownId = (state) => state.ui.activeDropdownId;
export const {
  setActiveDropdownId,
  clearActiveDropdownId,
  toggleActiveDropdownId } = uiSlice.actions;
export default uiSlice.reducer;