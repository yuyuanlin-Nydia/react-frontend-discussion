import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isLogin: false,
  refreshToken: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logHandler(state,action) {
      state.isLogin = action.payload;
    },
  },
});
export default authSlice.reducer;
export const authAction = authSlice.actions;
