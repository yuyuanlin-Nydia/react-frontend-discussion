import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchSingleQuestion } from '../store/question-action'
import classes from './QuestionConPage.module.css'
import QuestionDetails from '../layout/QuestionDetails'
import AnswerList from '../component/answer/AnswerList'
import { fetchCommentData } from '../store/comment-action'
import Icon from '@mdi/react'
import { mdiArrowLeft } from '@mdi/js'

function QuestionConPage () {
  const singleQuestion = useSelector((state) => state.questions.singleQuestionData)
  const commentsData = useSelector((state) => state.comments.items)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const paramsQuestionId = useParams().questionId
  useEffect(() => {
    dispatch(fetchSingleQuestion(paramsQuestionId))
    dispatch(fetchCommentData(paramsQuestionId))
  }, [dispatch, paramsQuestionId, commentsData])

  const goBackHandler = () => {
    navigate(-1)
  }
  return (
    <div className={classes.questionConContainter}>
      <div className={classes.goBackBtn} onClick={goBackHandler}>
        <div>
          <Icon path={mdiArrowLeft} size={0.8} class={classes.goBackBtnIcon}/>Back
        </div>
      </div>

      <QuestionDetails questionData={singleQuestion} />
      <AnswerList answerData={commentsData} />
    </div>
  )
}

export default QuestionConPage
