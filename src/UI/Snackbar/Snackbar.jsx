import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { snackbarActions } from '../../store/snackbar-slice'
import classes from './Snackbar.module.css'
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'

const Snackbar = () => {
  const dispatch = useDispatch()
  const { isOpen, message, icon, duration, bgColor, showCloseIcon, top, center, bottom } = useSelector(
    (state) => state.snackbar
  )

  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        dispatch(snackbarActions.closeSnackbar())
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, dispatch])

  if (!isOpen) return null

  // 根據 Redux 狀態決定位置 Class
  let positionClass = classes.center // 預設
  if (top) positionClass = classes.top
  if (center) positionClass = classes.center
  if (bottom) positionClass = classes.bottom

  return (
    <div
      className={`${classes.snackbar} ${positionClass}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className={classes.content}>
        {icon && <Icon path={icon} size={1} color="white" />}
        <span>{message}</span>
      </div>
      {showCloseIcon && (
        <button
          className={classes.closeBtn}
          onClick={() => dispatch(snackbarActions.closeSnackbar())}
        >
          <Icon path={mdiClose} size={0.8} color="grey" />
        </button>
      )}
    </div>
  )
}

export default Snackbar
