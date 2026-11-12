import React, { Fragment, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Modal from '../Modal'
import ModalWrapper from '../ModalWrapper'
import classes from './ConfirmDialog.module.css'

ConfirmDialog.propTypes = {
  title: PropTypes.string,
  message: PropTypes.node,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  danger: PropTypes.bool,
  isLoading: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

function ConfirmDialog ({
  title = '確認',
  message,
  confirmText = '確定',
  cancelText = '取消',
  danger = false,
  isLoading = false,
  onConfirm,
  onCancel
}) {
  const cancelRef = useRef(null)
  const latest = useRef({ onCancel, isLoading })
  latest.current = { onCancel, isLoading }

  // 開啟時聚焦在「取消」，避免誤按 Enter 直接執行；按 Esc 關閉
  useEffect(() => {
    cancelRef.current?.focus()
    const keyHandler = (e) => {
      if (e.key === 'Escape' && !latest.current.isLoading) latest.current.onCancel()
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  }, [])

  return (
    <Fragment>
      <Modal className={classes.modal}>
        <div className={classes.dialog} role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
          <h6 id="confirm-dialog-title" className={classes.title}>{title}</h6>
          {message && <p className={classes.message}>{message}</p>}
          <div className={classes.actions}>
            <button
              ref={cancelRef}
              type="button"
              className={classes.cancelBtn}
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`${classes.confirmBtn} ${danger ? classes.danger : ''}`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? '處理中...' : confirmText}
            </button>
          </div>
        </div>
      </Modal>
      <ModalWrapper onClickModal={isLoading ? undefined : onCancel} />
    </Fragment>
  )
}

export default ConfirmDialog
