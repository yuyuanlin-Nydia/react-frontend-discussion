import React, { useState } from 'react'
import classes from './AnswerList.module.css'
import { useParams } from 'react-router-dom'
import AnswerCard from './AnswerCard'
import Button from '../../UI/Button'
import { addAnswer } from '../../store/answer-action'
import { getErrorMessage } from '../../lib/errorMessage'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { snackbarActions } from '../../store/snackbar-slice'

AnswerList.propTypes = {
  answerData: PropTypes.array,
  onSubmitSuccess: PropTypes.func,
  isAnswerLoading: PropTypes.bool
}

function AnswerList ({ answerData, onSubmitSuccess, isAnswerLoading }) {
  const dispatch = useDispatch()
  const [reply, setReply] = useState('')
  const { displayName, email, isLogin } = useSelector((state) => state.auth)
  const paramsQuestionId = useParams().questionId
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitReplyHandler = async () => {
    const trimmed = reply.trim()
    if (!trimmed || isSubmitting) return
    const data = {
      email,
      author: displayName,
      answer: trimmed,
      time: new Date()
    }
    setIsSubmitting(true)
    try {
      await addAnswer(data, paramsQuestionId)
      dispatch(snackbarActions.showSnackbar({ message: '已成功新增回覆!' }))
      setReply('')
      onSubmitSuccess()
    } catch (error) {
      if (error?.code === 'ANSWER_COUNT_SYNC') {
        // 回覆已送出，只是回答數量沒更新成功
        dispatch(snackbarActions.showSnackbar({ message: '回覆已送出，但回答數量更新失敗', bgColor: 'var(--warning)' }))
        setReply('')
        onSubmitSuccess()
      } else {
        dispatch(snackbarActions.showSnackbar({
          message: getErrorMessage(error, '回覆失敗，請稍後再試'),
          bgColor: 'var(--error)'
        }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = !!reply.trim() && !isSubmitting
  const btnClass = canSubmit ? `${classes.submitBtn}` : `${classes.submitBtn} ${classes.disabled}`
  if (isAnswerLoading) {
    return <div className={classes.answerConContainer}>載入中...</div>
  }
  return (
    <div className={classes.answerConContainer}>
      <div className={classes.answerAmount}>{answerData.length} {answerData.length > 1 ? 'Answers' : 'Answer'}</div>
      {answerData.map((answer) => (
        <AnswerCard
          answerData={answer}
          key={answer.id}
          onChange={onSubmitSuccess}
        />
      ))}
      { isLogin && <div className={classes.replySection}>
        <h6 className={classes.replyTitle}>Your Reply</h6>
        <textarea aria-label="Your Reply" value={reply} onChange={(e) => setReply(e.target.value)} />
        <Button
          disabled={!canSubmit}
          classBtn={btnClass}
          clickEvent={submitReplyHandler}
        >
          送出
        </Button>
      </div>
      }
    </div>
  )
}

export default AnswerList
