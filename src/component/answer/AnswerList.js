import React, { useRef } from 'react'
import classes from './AnswerList.module.css'
import { useParams } from 'react-router-dom'
import AnswerCard from './AnswerCard'
import Button from '../../UI/Button'
import { addAnswer } from '../../store/comment-action'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

AnswerList.propTypes = {
  answerData: PropTypes.array
}

function AnswerList (props) {
  const userAccount = useSelector((state) => state.auth.userAccount)
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
    commentTextRef.current.value = ''
  }
  return (
    <div className={classes.answerConContainer}>
      <div className={classes.answerAmount}>{answerData.length} {answerData.length > 0 ? 'Answers' : 'Answer'}</div>
      {answerData.map((answer) => (
        <AnswerCard answerData={answer} key={answer.id} />
      ))}
      <div className={classes.replySection}>
        <h6 className={classes.replyTitle}>Your Rely</h6>
        <textarea ref={commentTextRef} />
        <Button
          classBtn={classes.submitBtn}
          clickEvent={submitReplyHandler}
        >
          確認送出
        </Button>
      </div>
    </div>
  )
}

export default AnswerList
