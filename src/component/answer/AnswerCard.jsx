import React, { useEffect, useRef, useState } from 'react'
import classes from './AnswerCard.module.css'
import formatDate from '../../lib/dateFormat'
import { getErrorMessage } from '../../lib/errorMessage'
import PropTypes from 'prop-types'
import Icon from '@mdi/react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { mdiAccount, mdiCalendarRange } from '@mdi/js'
import { editAnswer, deleteAnswer, addReply, editReply, deleteReply } from '../../store/answer-action'
import { snackbarActions } from '../../store/snackbar-slice'
import ConfirmDialog from '../../UI/ConfirmDialog/ConfirmDialog'

AnswerCard.propTypes = {
  answerData: PropTypes.object,
  // 有值時代表此卡片為該回答留言串中的回覆
  parentId: PropTypes.string,
  onChange: PropTypes.func,
  // 僅留言串中的回覆使用：點擊「回覆」時通知所屬留言串開啟回覆框
  onReply: PropTypes.func
}

function AnswerCard ({ answerData, parentId, onChange, onReply }) {
  const isReply = !!parentId
  const { id, author, answer, email: authorEmail, updateTime } = answerData
  const replies = answerData.replies || []
  // 舊資料的建立時間存在 createTime
  const createdAt = answerData.time || answerData.createTime
  const { isLogin, displayName, email } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const questionId = useParams().questionId
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(answer)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // 留言串回覆框（只有最上層的回答會用到）
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isReplySubmitting, setIsReplySubmitting] = useState(false)
  const [replyFocusKey, setReplyFocusKey] = useState(0)
  const replyInputRef = useRef(null)

  useEffect(() => {
    if (!replyFocusKey) return
    replyInputRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
    replyInputRef.current?.focus()
  }, [replyFocusKey])

  // 有 email 時以 email 判斷；舊資料沒有 email 才退回比對作者名稱
  const isMyAnswer = isLogin && (
    authorEmail && email
      ? authorEmail === email
      : !!author && author === displayName
  )

  const showSnackbar = (message, bgColor) => {
    dispatch(snackbarActions.showSnackbar(bgColor ? { message, bgColor } : { message }))
  }

  // 開啟本留言串的回覆框；回覆串中的某則回覆時，在前面加上 @作者
  const openReplyForm = (mentionAuthor) => {
    if (mentionAuthor) {
      const mention = `@${mentionAuthor} `
      setReplyText((prev) => (prev.startsWith(mention) ? prev : mention + prev))
    }
    setIsReplying(true)
    setReplyFocusKey((key) => key + 1)
  }

  const replyClickHandler = () => {
    if (isReply) {
      onReply && onReply(author)
    } else {
      openReplyForm()
    }
  }

  const cancelReply = () => {
    setIsReplying(false)
    setReplyText('')
  }

  const submitReply = async () => {
    const trimmed = replyText.trim()
    if (!trimmed || isReplySubmitting) return
    setIsReplySubmitting(true)
    try {
      await addReply({ email, author: displayName, answer: trimmed, time: new Date() }, questionId, id)
      setIsReplying(false)
      setReplyText('')
      showSnackbar('已成功新增回覆!')
      onChange && onChange()
    } catch (error) {
      showSnackbar(getErrorMessage(error, '回覆失敗，請稍後再試'), 'var(--error)')
    } finally {
      setIsReplySubmitting(false)
    }
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
      if (isReply) {
        await editReply(questionId, parentId, id, trimmed)
      } else {
        await editAnswer(questionId, id, trimmed)
      }
      setIsEditing(false)
      showSnackbar('已成功更新回覆!')
      onChange && onChange()
    } catch (error) {
      showSnackbar(getErrorMessage(error, '更新失敗，請稍後再試'), 'var(--error)')
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      if (isReply) {
        await deleteReply(questionId, parentId, id)
      } else {
        await deleteAnswer(questionId, id)
      }
      setShowDeleteConfirm(false)
      showSnackbar('已成功刪除回覆!')
      onChange && onChange()
    } catch (error) {
      if (error?.code === 'ANSWER_COUNT_SYNC') {
        // 回覆已刪除，只是回答數量沒更新成功，仍需重新載入列表
        setShowDeleteConfirm(false)
        showSnackbar('回覆已刪除，但回答數量更新失敗', 'var(--warning)')
        onChange && onChange()
      } else {
        showSnackbar(getErrorMessage(error, '刪除失敗，請稍後再試'), 'var(--error)')
        setIsSubmitting(false)
      }
    }
  }

  const deleteMessage = !isReply && replies.length > 0
    ? `確定要刪除這則回覆嗎？底下的 ${replies.length} 則回覆也會一併刪除，且無法復原。`
    : '確定要刪除這則回覆嗎？刪除後無法復原。'
  const canSubmitReply = !!replyText.trim() && !isReplySubmitting
  const showReplyForm = !isReply && isLogin && isReplying
  const canReply = isReply ? !!onReply : true

  return (
    <div className={isReply ? classes.replyCard : classes.answerCard}>
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
            : createdAt && <span>{formatDate(new Date(createdAt))}</span>
          }
        </div>
        {isLogin && !isEditing && (
          <div className={classes.answerAction}>
            {canReply && <div className={classes.textBtn} onClick={replyClickHandler}>回覆</div>}
            {isMyAnswer && <div className={classes.textBtn} onClick={startEdit}>編輯</div>}
            {isMyAnswer && <div className={classes.textBtn} onClick={() => setShowDeleteConfirm(true)}>刪除</div>}
          </div>
        )}
      </div>
      {!isReply && (replies.length > 0 || showReplyForm) && (
        <div className={classes.thread}>
          {replies.map((reply) => (
            <AnswerCard
              key={reply.id}
              answerData={reply}
              parentId={id}
              onChange={onChange}
              onReply={openReplyForm}
            />
          ))}
          {showReplyForm && (
            <div className={classes.editInputContainer}>
              <textarea
                ref={replyInputRef}
                className={classes.editInput}
                aria-label={`回覆 ${author || ''}`.trim()}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <span
                className={`${classes.confirmEditBtn} ${canSubmitReply ? '' : classes.disabled}`}
                onClick={submitReply}
              >
                送出回覆
              </span>
              <span className={classes.cancelEditBtn} onClick={cancelReply}>取消回覆</span>
            </div>
          )}
        </div>
      )}
      {showDeleteConfirm && (
        <ConfirmDialog
          title="刪除回覆"
          message={deleteMessage}
          confirmText="刪除"
          danger
          isLoading={isSubmitting}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  )
}

export default AnswerCard
