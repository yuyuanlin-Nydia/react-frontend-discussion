import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchSingleQuestion } from '../store/question-action'
import classes from './QuestionDetailsPage.module.css'
import AnswerList from '../component/answer/AnswerList'
import { fetchAnswerData } from '../store/answer-action'
import Icon from '@mdi/react'
import { mdiArrowLeft } from '@mdi/js'

function QuestionDetailsPage () {
  const [isQuestionLoading, setIsQuestionLoading] = useState(true)
  const [isAnswerLoading, setIsAnswerLoading] = useState(true)

  const singleQuestion = useSelector(
    (state) => state.questions.singleQuestionData
  )
  const answersData = useSelector((state) => state.answers.items)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const paramsQuestionId = useParams().questionId
  useEffect(() => {
    const loadQuestionDetails = async () => {
      await dispatch(fetchSingleQuestion(paramsQuestionId))
      setIsQuestionLoading(false)
    }
    loadQuestionDetails()
  }, [dispatch, paramsQuestionId])

  useEffect(() => {
    const loadAnswers = async () => {
      await dispatch(fetchAnswerData(paramsQuestionId))
      setIsAnswerLoading(false)
    }
    loadAnswers()
  }, [dispatch, paramsQuestionId])

  const goBackHandler = () => {
    navigate(-1)
  }
  return (
    <div>
      <div className={classes.goBackBtn} onClick={goBackHandler}>
        <div>
          <Icon
            path={mdiArrowLeft}
            size={0.8}
            className={classes.goBackBtnIcon}
          />
          Back
        </div>
      </div>

      <div className={classes.questionDataCard}>
        {isQuestionLoading
          ? <div>載入中</div>
          : <div>
          <div className={classes.questionTitle}>{singleQuestion.title}</div>
          <div className={classes.questionSubTitle}>
            <span>Viewed {singleQuestion.views} times</span>
            <span>{singleQuestion.votes} votes</span>
          </div>
          <div className={classes.questionDescription}>{singleQuestion.description}</div>
          <div className={classes.questionTags}>
            <div className={classes.questionTag}>jQuery</div>
            <div className={classes.questionTag}>javascript
            </div>
          </div>
        </div>
        }

      </div>
      <AnswerList answerData={answersData} />
    </div>
  )
}

export default QuestionDetailsPage
