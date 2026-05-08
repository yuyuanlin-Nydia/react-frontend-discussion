import React from 'react'
import PropTypes from 'prop-types'

Button.propTypes = {
  classBtn: PropTypes.string,
  clickEvent: PropTypes.func,
  type: PropTypes.string,
  children: PropTypes.node
}

function Button (props) {
  const btnClasses = props.classBtn
  return (
    <button onClick={props.clickEvent} type={props.type} className={btnClasses} >{props.children}</button>
  )
}

export default Button
