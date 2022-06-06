import { useSelector } from "react-redux";

import classes from "./Nav.module.css";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authAction } from "../store/auth-slice";

const Nav = () => {
  const isLoginSta = useSelector((state) => state.auth.isLogin);
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(authAction.logHandler(false));
  };
  return (
    <nav className={classes.navBar}>
      <NavLink to="/">
        <div className={classes.webName}>Frontend Discussion</div>
      </NavLink>
      <ul>
        {!isLoginSta && (
          <NavLink to="/authentication">
            <li>登入/註冊</li>
          </NavLink>
        )}
        {isLoginSta && <li onClick={logoutHandler}>登出</li>}
      </ul>
    </nav>
  );
};

export default Nav;
