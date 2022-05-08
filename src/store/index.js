import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialQuestionState = { items: [] };

const questionSlice = createSlice({
  name: "questions",
  initialState: initialQuestionState,
  reducers: {
    replaceQuestion(state, action) {
      state.items = action.payload;
    },

    // addQuestion() {},
    // removeQuestion() {},
  },
});

const store = configureStore({
  reducer: { questions: questionSlice.reducer },
});
export const questionAction = questionSlice.actions;
// export const questionReducers = questionSlice.reducer;
export default store;
const firebaseDomain =
  "https://frontend-discussion-default-rtdb.firebaseio.com";
export const fetchQuestionData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(`${firebaseDomain}/questions.json`);
      const data = await response.json();
      return data;
    };
    try {
      const questionData = await fetchData();
      const transformedQuotes = [];

      for (const key in questionData) {
        const quoteObj = {
          id: key,
          ...questionData[key],
        };
        transformedQuotes.push(quoteObj);
      }
      dispatch(questionSlice.actions.replaceQuestion(transformedQuotes || []));
      if (!localStorage.getItem("myQuestionData")) {
        localStorage.setItem("myQuestionData", questionData);
      }
    } catch (error) {
      console.log(error);
    }
  };
};
export const fetchSingleQuestion = (questionId) => {
  return async (dispatch) => {
    const response = await fetch(
      `${firebaseDomain}/questions/${questionId}.json`
    );
    const data = await response.json();
    const loadedQuestion = {
      id: questionId,
      ...data,
    };
    dispatch(
      questionSlice.actions.replaceQuestion({
        items: loadedQuestion || [],
      })
    );
  };
};
export async function addQuestion(questionData) {
  const response = await fetch(`${firebaseDomain}/questions.json`, {
    method: "POST",
    body: JSON.stringify(questionData),
    "Content-Type": "application/json",
  });
  const data = await response.json();
  console.log(data);
}
