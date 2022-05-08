import React from 'react'
import classes from './ModalWrapper.module.css'
function ModalWrapper(props) {
  return (
    <div onClick={props.onClickModal} className={classes.modalWrapper}></div>
  )
}

export default ModalWrapper