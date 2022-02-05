import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./navbarSlice";

// see redux docs for implementation later https://react-redux.js.org/tutorials/quick-start
export default configureStore({
  reducer: {
    navbar: navbarReducer,
  },
});
