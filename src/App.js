import React, { Fragment } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './App.css'
import Nav from './layout/Nav'
import IndexPage from './page/IndexPage'
import JobPage from './page/JobPage'
import DocumentationPage from './page/DocumentationPage'
import QuestionConPage from './page/QuestionConPage'
import AuthenticationPage from './page/AuthenticationPage'
function App () {
  const isLoginSta = useSelector((state) => {
    return state.auth.isLogin
  })
  return (
    <Fragment>
      <Nav />
      <section className="displayCon">
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="question" element={<IndexPage />} />
          <Route path="job" element={<JobPage />} />
          <Route path="documentation" element={<DocumentationPage />} />
          <Route
            path="/question/question-details/:questionId"
            element={<QuestionConPage />}
          />
          {!isLoginSta && (
            <Route path="/authentication" element={<AuthenticationPage />} />
          )}
          {isLoginSta && <Route path="/" element={<IndexPage />} />}
        </Routes>
      </section>
    </Fragment>
  )
}

export default App
