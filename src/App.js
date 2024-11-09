import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './App.css'
import Nav from './layout/Nav'
import IndexPage from './page/IndexPage'
import QuestionConPage from './page/QuestionConPage'
import AuthenticationPage from './page/AuthenticationPage'
function App () {
  const isLoginSta = useSelector((state) => {
    return state.auth.isLogin
  })
  return (
    <div className="App">
      <Nav />
      <section className="displayCon">
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route
            path="question-details/:questionId"
            element={<QuestionConPage />}
          />
          {!isLoginSta && (
            <Route path="/authentication" element={<AuthenticationPage />} />
          )}
          {isLoginSta && (
            <Route path="/" element={<IndexPage />} />
          )}
        </Routes>
        </section>
    </div>
  )
}

export default App
