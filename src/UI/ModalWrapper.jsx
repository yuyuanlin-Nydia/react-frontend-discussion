import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import classes from './ModalWrapper.module.css'
import PropTypes from 'prop-types'

ModalWrapper.propTypes = {
  onClickModal: PropTypes.func
}

function ModalWrapper (props) {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <div
          onClick={props.onClickModal}
          className={classes.modalWrapper}
        ></div>,
        document.getElementById('modal-root')
      )}
    </Fragment>
  )
}

export default ModalWrapper
