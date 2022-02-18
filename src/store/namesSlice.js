import { createSlice } from "@reduxjs/toolkit";

export const namesSlice = createSlice({
  name: "names",
  initialState: {
    ownerNames: {},
  },
  reducers: {
    setOwnerNames: (state, action) => {
      state.ownerNames = action.payload;
    },
  },
});

export const { setOwnerNames } = namesSlice.actions;
export default namesSlice.reducer;
