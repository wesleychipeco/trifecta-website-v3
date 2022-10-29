import { createSlice } from "@reduxjs/toolkit";

export const currentVariables = createSlice({
  name: "currentVariables",
  initialState: {
    isReady: false,
    seasonVariables: {
      currentYear: "",
      isBasketballStarted: false,
      isBasketballInSeason: false,
      isBaseballStarted: false,
      isBaseballInSeason: false,
      isFootballStarted: false,
      isFootballInSeason: false,
      basketballAhead: false,
    },
  },
  reducers: {
    setSeasonVariables: (state, action) => {
      state.isReady = true;
      state.seasonVariables = action.payload;
    },
  },
});

export const { setSeasonVariables } = currentVariables.actions;
export default currentVariables.reducer;
