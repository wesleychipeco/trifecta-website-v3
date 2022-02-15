import { createSlice } from "@reduxjs/toolkit";

export const navbarSlice = createSlice({
  name: "navbar",
  initialState: {
    isNavbarOpen: false,
    seasonVariables: {
      currentYear: "",
      isBasketballStarted: false,
      isBaseballStarted: false,
      isFootballStarted: false,
    },
  },
  reducers: {
    openNavbar: (state) => {
      state.isNavbarOpen = true;
    },
    closeNavbar: (state) => {
      state.isNavbarOpen = false;
    },
    setSeasonVariables: (state, action) => {
      state.seasonVariables = action.payload;
    },
  },
});

export const { openNavbar, closeNavbar, setSeasonVariables } =
  navbarSlice.actions;
export default navbarSlice.reducer;
