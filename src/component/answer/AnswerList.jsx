import React, { useRef } from 'react'
import classes from './AnswerList.module.css'
import { useParams } from 'react-router-dom'
import AnswerCard from './AnswerCard'
import Button from '../../UI/Button'
import { addAnswer, fetchCommentData } from '../../store/comment-action'
import { updateQuestionAnswerCount } from '../../store/question-action'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

AnswerList.propTypes = {
  answerData: PropTypes.array
}

function AnswerList (props) {
  const userAccount = useSelector((state) => state.auth.userAccount)
  const isLogin = useSelector((state) => {
    return state.auth.isLogin
  })
  const { answerData } = props
  const paramsQuestionId = useParams().questionId
  const commentTextRef = useRef('')
  const submitReplyHandler = () => {
    const data = {
      account: userAccount,
      author: 'Scott Lowie',
      answer: commentTextRef.current.value,
      time: new Date()
    }
    addAnswer(data, paramsQuestionId)
    updateQuestionAnswerCount(paramsQuestionId, { answerCount: answerData.length + 1 })
    commentTextRef.current.value = ''
    fetchCommentData(paramsQuestionId)
  }
  return (
    <div className={classes.answerConContainer}>
      <div className={classes.answerAmount}>{answerData.length} {answerData.length > 0 ? 'Answers' : 'Answer'}</div>
      {answerData.map((answer) => (
        <AnswerCard answerData={answer} key={answer.id} />
      ))}
      { isLogin && <div className={classes.replySection}>
        <h6 className={classes.replyTitle}>Your Reply</h6>
        <textarea ref={commentTextRef} />
        <Button
          classBtn={classes.submitBtn}
          clickEvent={submitReplyHandler}
        >
          確認送出
        </Button>
      </div>
      }
    </div>
  )
}

export default AnswerList
