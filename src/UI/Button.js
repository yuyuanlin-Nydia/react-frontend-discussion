import React from 'react'
import classes from './Button.module.css'

function Button(props) {
  return (
    <button onClick={props.clickEvent} type={props.type} className={classes.btnPink}>{props.children}</button>
  )
}

export default Button