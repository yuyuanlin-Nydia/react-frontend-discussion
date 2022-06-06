import { createSlice } from "@reduxjs/toolkit";

const initialQuestionState = { items: [],singleQuestionData:{} };

const questionSlice = createSlice({
  name: "questions",
  initialState: initialQuestionState,
  reducers: {
    getQuestionsData(state, action) {
      state.items = action.payload;
    },
    getSingleQuestionData(state, action) {
      state.singleQuestionData = action.payload;
    },
  },
});
export default questionSlice.reducer;
export const questionAction = questionSlice.actions;


