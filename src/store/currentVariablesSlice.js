import { createSlice } from "@reduxjs/toolkit";

export const currentVariables = createSlice({
  name: "currentVariables",
  initialState: {
    seasonVariables: {
      currentYear: "",
      isBasketballStarted: false,
      isBaseballStarted: false,
      isFootballStarted: false,
    },
  },
  reducers: {
    setSeasonVariables: (state, action) => {
      state.seasonVariables = action.payload;
    },
  },
});

export const { setSeasonVariables } = currentVariables.actions;
export default currentVariables.reducer;
