import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import classes from './Modal.module.css'
import PropTypes from 'prop-types'

Modal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

function Modal (props) {
  const modalClass = props.className ? `${classes.modal} ${props.className}` : classes.modal
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <div className={modalClass}>{props.children}</div>,
        document.getElementById('modal-root')
      )}
    </Fragment>
  )
}

export default Modal
