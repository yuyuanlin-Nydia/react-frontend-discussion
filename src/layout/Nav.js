import classes from './Nav.module.css'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { authAction } from '../store/auth-slice'

const Nav = () => {
  const loginData = useSelector((state) => state.auth)
  const { isLogin, userAccount } = loginData
  const dispatch = useDispatch()
  const logoutHandler = () => {
    dispatch(authAction.logHandler(false))
  }
  return (
    <nav className={classes.navBar}>
      <NavLink to="/">
        <div className={classes.webName}>Frontend Discussion</div>
      </NavLink>
      <ul>
        {!isLogin && (
          <NavLink to="/authentication">
            <li>登入/註冊</li>
          </NavLink>
        )}
        {isLogin && <li onClick={logoutHandler}> {userAccount}您好  登出</li>}
      </ul>
    </nav>
  )
}

export default Nav
