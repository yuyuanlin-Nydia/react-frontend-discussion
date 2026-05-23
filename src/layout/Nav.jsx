import classes from './Nav.module.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { authAction } from '../store/auth-slice'
import React, { useState } from 'react'
import { snackbarActions } from '../store/snackbar-slice'
import { mdiInformation } from '@mdi/js'
import logoHorizontal from '../../assets/images/logo/logoHorizontal.png'

const Nav = () => {
  const loginData = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const { isLogin, displayName } = loginData
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
    localStorage.removeItem('idToken')
    localStorage.removeItem('userInfo')
    dispatch(authAction.logout())
    dispatch(snackbarActions.showSnackbar({
      message: '您已成功登出！',
      icon: mdiInformation
    }))
    navigate('/', { replace: true })
  }
  return (
    <nav className={classes.navBar}>
      <div className={classes.logoBar}>
        <NavLink to="/question">
          <div className={classes.webName}>
            <img src={logoHorizontal} className={classes.logo} alt="Logo" />
          </div>
        </NavLink>
          {!isLogin && (
          <NavLink to="/authentication" className={classes.logInBtn}>
           登入/註冊
          </NavLink>
          )}
        {isLogin && <div className={classes.logInText}>
          <span> {displayName}您好&nbsp;</span>
          <span className={classes.logOutBtn} onClick={logoutHandler}>登出</span>
        </div>}
      </div>
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
      </div>
    </nav>
  )
}

export default Nav
