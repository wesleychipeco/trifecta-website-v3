import { createSlice } from "@reduxjs/toolkit";

export const navbarSlice = createSlice({
  name: "navbar",
  initialState: {
    isNavbarOpen: false,
  },
  reducers: {
    openNavbar: (state) => {
      state.isNavbarOpen = true;
    },
    closeNavbar: (state) => {
      state.isNavbarOpen = false;
    },
  },
});

export const { openNavbar, closeNavbar } = navbarSlice.actions;
export default navbarSlice.reducer;
