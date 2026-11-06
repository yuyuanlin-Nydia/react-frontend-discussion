import React, { useState } from 'react'
import classes from './AnswerCard.module.css'
import formatDate from '../../lib/dateFormat'
import PropTypes from 'prop-types'
import Icon from '@mdi/react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { mdiAccount, mdiCalendarRange } from '@mdi/js'
import { editAnswer, deleteAnswer } from '../../store/answer-action'
import { snackbarActions } from '../../store/snackbar-slice'

AnswerCard.propTypes = {
  answerData: PropTypes.object,
  onChange: PropTypes.func,
  onReply: PropTypes.func
}

function AnswerCard ({ answerData, onChange, onReply }) {
  const { id, author, answer, email: authorEmail, time, updateTime } = answerData
  const { isLogin, displayName, email } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const questionId = useParams().questionId
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(answer)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 有 email 時以 email 判斷；舊資料沒有 email 才退回比對作者名稱
  const isMyAnswer = isLogin && (
    authorEmail && email
      ? authorEmail === email
      : !!author && author === displayName
  )

  const showError = (message) => {
    dispatch(snackbarActions.showSnackbar({ message, bgColor: 'var(--error)' }))
  }

  const startEdit = () => {
    setEditText(answer)
    setIsEditing(true)
  }

  const confirmEdit = async () => {
    const trimmed = editText.trim()
    if (!trimmed || isSubmitting) return
    if (trimmed === answer) {
      setIsEditing(false)
      return
    }
    setIsSubmitting(true)
    try {
      await editAnswer(questionId, id, trimmed)
      setIsEditing(false)
      dispatch(snackbarActions.showSnackbar({ message: '已成功更新回覆!' }))
      onChange && onChange()
    } catch (error) {
      showError('更新失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (isSubmitting || !window.confirm('確定要刪除這則回覆嗎？')) return
    setIsSubmitting(true)
    try {
      await deleteAnswer(questionId, id)
      dispatch(snackbarActions.showSnackbar({ message: '已成功刪除回覆!' }))
      onChange && onChange()
    } catch (error) {
      showError('刪除失敗，請稍後再試')
      setIsSubmitting(false)
    }
  }

  return (
    <div className={classes.answerCard}>
      {isEditing
        ? (
        <div className={classes.editInputContainer}>
          <textarea
            className={classes.editInput}
            aria-label="編輯回覆"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <span
            className={`${classes.confirmEditBtn} ${!editText.trim() || isSubmitting ? classes.disabled : ''}`}
            onClick={confirmEdit}
          >
            確認
          </span>
          <span className={classes.cancelEditBtn} onClick={() => setIsEditing(false)}>取消編輯</span>
        </div>
          )
        : <p className={classes.answer}>{answer}</p>
      }
      <div className={classes.answerInfo}>
        <div className={classes.answerAuthor}>
          <Icon path={mdiAccount} size={0.8} />
          <span>{author}</span>
        </div>
        <div className={classes.answerDate}>
          <Icon path={mdiCalendarRange} size={0.8} />
          {updateTime
            ? <span>{formatDate(new Date(updateTime))} 更新</span>
            : time && <span>{formatDate(new Date(time))}</span>
          }
        </div>
        {isLogin && !isEditing && (
          <div className={classes.answerAction}>
            {onReply && <div className={classes.textBtn} onClick={() => onReply(author)}>回覆</div>}
            {isMyAnswer && <div className={classes.textBtn} onClick={startEdit}>編輯</div>}
            {isMyAnswer && <div className={classes.textBtn} onClick={handleDelete}>刪除</div>}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnswerCard
