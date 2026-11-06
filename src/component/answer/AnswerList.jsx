import React, { useRef, useState } from 'react'
import classes from './AnswerList.module.css'
import { useParams } from 'react-router-dom'
import AnswerCard from './AnswerCard'
import Button from '../../UI/Button'
import { addAnswer } from '../../store/answer-action'
import { addAnswerCount } from '../../store/question-action'
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
  const submitReplyHandler = async () => {
    const data = {
      email,
      author: displayName,
      answer: reply,
      time: new Date()
    }
    await Promise.all([addAnswer(data, paramsQuestionId), addAnswerCount(paramsQuestionId)])
    dispatch(snackbarActions.showSnackbar({
      message: '已成功新增回覆!'
    }))
    setReply('')
    onSubmitSuccess()
  }

  const replyRef = useRef(null)
  // 點擊回答的「回覆」：在輸入框前加上 @作者 並聚焦
  const replyToHandler = (author) => {
    const mention = `@${author} `
    setReply((prev) => (prev.startsWith(mention) ? prev : mention + prev))
    replyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    replyRef.current?.focus()
  }

  const btnClass = reply ? `${classes.submitBtn}` : `${classes.submitBtn} ${classes.disabled}`
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
          onReply={replyToHandler}
        />
      ))}
      { isLogin && <div className={classes.replySection}>
        <h6 className={classes.replyTitle}>Your Reply</h6>
        <textarea ref={replyRef} aria-label="Your Reply" value={reply} onChange={(e) => setReply(e.target.value)} />
        <Button
          disabled={!reply}
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
