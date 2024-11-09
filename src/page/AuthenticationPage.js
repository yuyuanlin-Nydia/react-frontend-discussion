import React from 'react'
import classes from './AuthenticationPage.module.css'
import AuthWelcome from '../layout/AuthWelcome'
import AuthInput from '../layout/AuthInput'

const Authentication = () => {
  return (
    <div className={classes.auth}>
      <AuthWelcome />
      <AuthInput />
    </div>
  )
}
export default Authentication
