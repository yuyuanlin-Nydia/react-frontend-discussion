import React from 'react'
import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import authSlice from '../store/auth-slice'
import questionSlice from '../store/question-slice'
import answerSlice from '../store/answer-slice'
import snackbarSlice from '../store/snackbar-slice'

const loggedOut = { isLogin: false, email: null, idToken: null, displayName: null }

// 以指定的 auth 狀態渲染元件，並提供 /question/question-details/:questionId 路由參數
export function renderWithStore (ui, { auth = {}, questionId = 'q1' } = {}) {
  const store = configureStore({
    reducer: {
      questions: questionSlice,
      auth: authSlice,
      answers: answerSlice,
      snackbar: snackbarSlice
    },
    preloadedState: { auth: { ...loggedOut, ...auth } }
  })
  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/question/question-details/${questionId}`]}>
        <Routes>
          <Route path="/question/question-details/:questionId" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
  return { store, ...result }
}
