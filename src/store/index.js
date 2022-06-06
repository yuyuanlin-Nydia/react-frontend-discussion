import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import questionSlice from "./question-slice";
import commentSlice from "./comment-slice";
const store = configureStore({
  reducer: { questions: questionSlice, auth: authSlice,comments:commentSlice }
});
export default store;
