import { createSlice } from '@reduxjs/toolkit'

const initialAnswerState = { items: [] }
const answerSlice = createSlice({
  name: 'answerSlice',
  initialState: initialAnswerState,
  reducers: {
    setAnswers (state, action) {
      state.items = action.payload
    }
  }
})
export default answerSlice.reducer
export const answerAction = answerSlice.actions
