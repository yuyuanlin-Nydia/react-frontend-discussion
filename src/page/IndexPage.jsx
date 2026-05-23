import React, { Fragment, useState, useEffect, useMemo } from 'react'
import QuestionList from '../component/question/QuestionList'
import classes from './IndexPage.module.css'
import AddQuestionModal from '../layout/AddQuestionModal'
import { useDispatch, useSelector } from 'react-redux'
import { fetchQuestions } from '../store/question-action'
import Icon from '@mdi/react'
import { mdiMapMarker, mdiInformation } from '@mdi/js'
import { snackbarActions } from '../store/snackbar-slice'
import { useNavigate } from 'react-router-dom'

function IndexPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLogin = useSelector((state) => state.auth.isLogin)
  const questionData = useSelector((state) => state.questions.items)

  const [currentTag, setCurrentTag] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadQuestions = async () => {
      await dispatch(fetchQuestions())
      setIsLoading(false)
    }
    loadQuestions()
  }, [dispatch])

  const modalHandler = () => {
    setShowModal((prevSta) => !prevSta)
  }

  const tagList = [
    { value: 'all', name: '全部' },
    { value: 'hot', name: '熱門' },
    { value: 'week', name: '本週' },
    { value: 'month', name: '本月' }
  ]

  const filteredQuestions = useMemo(() => {
    if (!questionData) return []
    switch (currentTag) {
      case 'all':
        return questionData
      case 'hot':
        return questionData.filter((item) => item.views >= 100)
      case 'week': {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        return questionData.filter((q) => new Date(q.time) >= oneWeekAgo)
      }
      case 'month': {
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        return questionData.filter((q) => new Date(q.time) >= oneMonthAgo)
      }
      default:
        return questionData
    }
  }, [questionData, currentTag])

  const openQuestionModal = () => {
    if (!isLogin) {
      dispatch(snackbarActions.showSnackbar({
        message: '請先登入！',
        icon: mdiInformation,
        bgColor: 'var(--warning)',
        duration: 1300
      }))
      setTimeout(() => {
        navigate('/authentication')
      }, 1000)
      return
    }
    setShowModal(true)
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
                <button onClick={openQuestionModal}>
                  我要發問
                </button>
            </div>
            <div className={classes.tags}>
              {tagList.map((tag) => {
                return <button
                  key={tag.value}
                  onClick={() => setCurrentTag(tag.value)}
                  className={ `${classes.tag} ${currentTag === tag.value && classes.active}`}>
                  {tag.name}
                  </button>
              })}
            </div>
          </div>
          <QuestionList questionList={filteredQuestions} isLoading={isLoading} />
        </section>
        <section className={classes.sideBarSection}>
          <div className={classes.topic}>Looking out for...</div>
          <div>
            <div className={classes.jobTitle}>Vue資深工程師</div>
            <div className={classes.jobCompany}>momo平台</div>
            <div className={classes.jobDetail}>
              <div className={classes.jobLocationContent}>
                <Icon path={mdiMapMarker} size={0.5} color="var(--base-200)"/>
                <div className={classes.jobLocation}>台中西區</div>
              </div>
              <div className={classes.natureOfWorkContent}>
                <Icon path={mdiInformation} size={0.5} color="var(--base-200)"/>
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
