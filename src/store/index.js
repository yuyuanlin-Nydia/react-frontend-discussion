import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth-slice'
import questionSlice from './question-slice'
import answerSlice from './answer-slice'
import snackbarSlice from './snackbar-slice'

const store = configureStore({
  reducer: {
    questions: questionSlice,
    auth: authSlice,
    answers: answerSlice,
    snackbar: snackbarSlice
  }
})

export default store
