import classes from './Nav.module.css'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { authAction } from '../store/auth-slice'
import React from 'react'

const Nav = () => {
  const loginData = useSelector((state) => state.auth)
  const { isLogin, userAccount } = loginData
  const dispatch = useDispatch()
  const logoutHandler = () => {
    dispatch(authAction.logHandler(false))
  }
  return (
    <nav className={classes.navBar}>
      <div>
        <NavLink to="/">
          <div className={classes.webName}>
            <img width="32" className={classes.webIcon} alt="The official Stack Overflow icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Stack_Overflow_icon.svg/512px-Stack_Overflow_icon.svg.png?20190716190036"/>
            frontend<span className={classes.bolder}>Discussion</span>
          </div>
        </NavLink>
      </div>
      <ul>
        {!isLogin && (
          <NavLink to="/authentication">
            <li className={classes.navLink}>登入/註冊</li>
          </NavLink>
        )}
        {isLogin && <li onClick={logoutHandler}> {userAccount}您好  登出</li>}
      </ul>
      <div className={classes.navFunctionalBar}>
        <div className={classes.menuList}>
          <div className={`${classes.active} ${classes.menuListItem}`}>Questions</div>
          <div className={classes.menuListItem}>Jobs</div>
          <div className={classes.menuListItem}>Documentation</div>
        </div>
        <div >
          <input
            className={classes.searchInput}
            placeholder='Search'
          />
        </div>
      </div>
    </nav>
  )
}

export default Nav
