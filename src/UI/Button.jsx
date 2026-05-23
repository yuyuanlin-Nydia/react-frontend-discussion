import React from 'react'
import PropTypes from 'prop-types'

Button.propTypes = {
  classBtn: PropTypes.string,
  clickEvent: PropTypes.func,
  type: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool
}

function Button (props) {
  const btnClasses = props.classBtn
  return (
    <button onClick={props.clickEvent} type={props.type} disabled={props.disabled} className={btnClasses} >{props.children} </button>
  )
}

export default Button
