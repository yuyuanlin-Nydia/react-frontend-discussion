import React from 'react'
import classes from './Modal.module.css'
function Modal(props) {
  return (
    <div className={classes.modal}>{props.children}</div>
  )
}

export default Modal