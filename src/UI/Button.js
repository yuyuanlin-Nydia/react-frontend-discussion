import React from 'react'
import classes from './Button.module.css'

function Button (props) {
  const btnClasses = classes.btn + ' ' + props.classBtn
  return (
    <button onClick={props.clickEvent} type={props.type} className={btnClasses} >{props.children}</button>
  )
}

export default Button
