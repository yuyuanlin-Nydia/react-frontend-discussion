import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import classes from './Modal.module.css'
function Modal (props) {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <div className={classes.modal}>{props.children}</div>,
        document.getElementById('modal-root')
      )}
    </Fragment>
  )
}

export default Modal
