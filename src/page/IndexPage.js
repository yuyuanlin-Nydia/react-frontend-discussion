import React, { Fragment, useState, useEffect, useCallback } from 'react'
import QuestionList from '../component/question/QuestionList'
import classes from './IndexPage.module.css'
import AddQuestionModal from '../layout/AddQuestionModal'
import { useDispatch } from 'react-redux'
import { fetchQuestionData } from '../store/question-action'
import Icon from '@mdi/react'
import { mdiMapMarker, mdiInformation } from '@mdi/js'

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
        <section className={classes.content}>
          <div className={classes.cardTitle}>
            <div className={classes.tabTitleContainer}>
              <div className={classes.title}>
                Questions
              </div>
              <div>
                <button className={'defaultBtn'}>
                  Ask Question
                </button>
              </div>
            </div>
            <div className={classes.tags}>
              <button className={`${classes.tag} ${classes.active}`}>interesting</button>
              <button className={classes.tag}>feature</button>
              <button className={classes.tag}>hot</button>
              <button className={classes.tag}>week</button>
              <button className={classes.tag}>month</button>
            </div>
          </div>
          <QuestionList />
        </section>
        <section className={classes.sideBarSection}>
          <div className={classes.topic}>Looking out for...</div>
          <div>
            <div className={classes.jobTitle}>Vue資深工程師</div>
            <div className={classes.jobCompany}>momo平台</div>
            <div className={classes.jobDetail}>
              <div className={classes.jobLocationContent}>
                <Icon path={mdiMapMarker} size={0.5} color="#A4A4A4"/>
                <div className={classes.jobLocation}>台中西區</div>
              </div>
              <div className={classes.natureOfWorkContent}>
                <Icon path={mdiInformation} size={0.5} color="#A4A4A4"/>
                <div className={classes.natureOfWork}>遠端</div>
              </div>
            </div>
            <div className={classes.jobTags}>
              <div className={classes.jobTag}>angularjs</div>
              <div className={classes.jobTag}>cordova</div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  )
}

export default IndexPage
