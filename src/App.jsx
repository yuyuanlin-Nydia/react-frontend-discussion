import React, { Fragment } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './App.css'
import Nav from './layout/Nav'
import IndexPage from './page/IndexPage'
import JobPage from './page/JobPage'
import DocumentationPage from './page/DocumentationPage'
import QuestionConPage from './page/QuestionConPage'
import AuthenticationPage from './page/AuthenticationPage'
import Snackbar from './UI/Snackbar/Snackbar'

function App () {
  const { pathname } = useLocation()
  const isLogin = useSelector((state) => {
    return state.auth.isLogin
  })
  return (
    <Fragment>
      {pathname !== '/authentication' && <Nav />}
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
          {!isLogin && (
            <Route path="/authentication" element={<AuthenticationPage />} />
          )}
          {isLogin && <Route path="/" element={<IndexPage />} />}
        </Routes>
      </section>
      <Snackbar />
    </Fragment>
  )
}

export default App
