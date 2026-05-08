import classes from './AuthWelcome.module.css'
import React from 'react'

const AuthWelcome = () => {
  return (
    <div className={classes.explain}>
      <h3>Welcome</h3>
      <h5>Frontend Discussion </h5>
      <ul>
        <li>詢問程式相關問題</li>
        <li>提升解題技巧</li>
        <li>了解職涯發展與規劃</li>
      </ul>
    </div>
  )
}
export default AuthWelcome
