import React, { Fragment, useState, useEffect, useCallback } from 'react'
import Logo from '../layout/Logo'
import Filter from '../layout/Filter'
import QuestionList from '../component/question/QuestionList'
import classes from './IndexPage.module.css'
import AddQuestionModal from '../layout/AddQuestionModal'
import { useDispatch } from 'react-redux'
import { fetchQuestionData } from '../store/question-action'
function IndexPage () {
  // avoid re-render
  const getData = useCallback(() => {
    fetchQuestionData()
  }, [])
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getData)
  }, [dispatch, getData])

  const [showModal, setShowModal] = useState(false)
  const modalHandler = () => {
    setShowModal((prevSta) => {
      return (prevSta = !prevSta)
    })
  }
  return (
    <Fragment>
      {showModal && <AddQuestionModal onClickModal={modalHandler} />}
      <div id={classes.container}>
        <nav className={classes.navBar}>
          <Logo />
        </nav>
        <section className={classes.content}>
          <Filter onClickModal={modalHandler} />
          <QuestionList />
        </section>
      </div>
    </Fragment>
  )
}

export default IndexPage
