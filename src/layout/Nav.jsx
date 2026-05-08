import classes from './Nav.module.css'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { authAction } from '../store/auth-slice'
import React, { useState } from 'react'

const Nav = () => {
  const loginData = useSelector((state) => state.auth)
  const { isLogin, userAccount } = loginData
  const [menuList] = useState([
    {
      label: 'Questions',
      path: '/question'
    },
    {
      label: 'Jobs',
      path: '/job'
    },
    {
      label: 'Documentation',
      path: '/documentation'
    }
  ])
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const logoutHandler = () => {
    dispatch(authAction.logHandler(false))
  }
  return (
    <nav className={classes.navBar}>
      <div>
        <NavLink to="/">
          <div className={classes.webName}>
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
        {isLogin && <li onClick={logoutHandler}> {userAccount}您好 登出</li>}
      </ul>
      <div className={classes.navFunctionalBar}>
        <div className={classes.menuList}>
          {menuList.map((menuItem) => (
            <NavLink
              key={menuItem.label}
              to={menuItem.path}
              className={`${pathname.includes(menuItem.path) ? classes.active : ''} ${classes.menuListItem}`}
            >
              {menuItem.label}
            </NavLink>
          ))}
        </div>
        <div>
          <input className={classes.searchInput} placeholder="Search" />
        </div>
      </div>
    </nav>
  )
}

export default Nav
