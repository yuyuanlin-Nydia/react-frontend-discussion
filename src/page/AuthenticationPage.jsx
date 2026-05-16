import classes from './AuthenticationPage.module.css'
import loginSideImg from '../../assets/images/loginSideImg.jpg'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authAction } from '../store/auth-slice'
import Button from '../UI/Button'
import { mdiEye, mdiEyeOff, mdiAccountKey, mdiEmail, mdiCheckCircle } from '@mdi/js'
import Input from '../UI/Input/Input'
import Snackbar from '../UI/Snackbar/Snackbar'
import logo from '../../assets/images/logo/logoHorizontalLong.png'

const Authentication = () => {
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState('logIn')
  const [warning, setWarning] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const tabs = [
    { value: 'logIn', name: '登入' },
    { value: 'signUp', name: '註冊' }
  ]
  const dispatch = useDispatch()
  const [email, setEmail] = useState('sandy6513ab@gmail.com')
  const [password, setPassword] = useState('')
  const handleClear = () => {
    setEmail('')
    setPassword('')
    setWarning('')
  }
  const warningObj = {
    EMAIL_EXISTS: '此電子郵件已註冊過',
    TOO_MANY_ATTEMPTS_TRY_LATER: '由於異常活動，我們已阻止來自此设备的所有请求。稍后再試。',
    'WEAK_PASSWORD : Password should be at least 6 characters': '密碼必須至少6個字母',
    INVALID_EMAIL: '沒有此電子信箱，請註冊！',
    INVALID_PASSWORD: '密碼不正確，請重新輸入!'
  }
  const handleWarning = (msg) => {
    setWarning(warningObj[msg] || '未知錯誤')
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState)
  }

  const loginHandler = async () => {
    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCYMgs7g9s73a3DTLuMFDhs2q1y3Mk85kg'
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      })
      const data = await response.json()
      if (data?.error?.message) {
        handleWarning(data.error.message)
        return
      }

      dispatch(authAction.logHandler({
        isLogin: true,
        loginData: data
      }))
      const { idToken, email: dataEmail, displayName } = data
      localStorage.setItem('idToken', idToken)
      localStorage.setItem('userInfo', JSON.stringify({
        email: dataEmail,
        displayName
      }))
      navigate('/', { replace: true })
    } catch (e) {
      console.error(e.message)
    }
  }

  const registerHandler = async () => {
    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCYMgs7g9s73a3DTLuMFDhs2q1y3Mk85kg'
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      })
      const data = await response.json()
      if (data?.error?.message) {
        handleWarning(data.error.message)
        return
      }
      Snackbar.show({
        message: '註冊成功！請使用新帳號登入。',
        icon: mdiCheckCircle
      })
      handleClear()
      setCurrentTab('logIn')
    } catch (e) {
      console.error(e.message)
    }
  }
  const changeTabHandler = (value) => {
    handleClear()
    setCurrentTab(value)
  }

  const btnClass = `${classes.loginBtn}  ${(!email || !password) ? classes.disabled : ''} `

  return (
    <div className={classes.auth}>
      <img src={loginSideImg} className={classes.loginSideImg} alt="Login Side Image" />
      <div className={classes.userTypeArea} >
        <img src={logo} alt="Logo" className={classes.logo} onClick={() => navigate('/question')} />
        <form onSubmit={(e) => e.preventDefault()}>
          <ul className={classes.tabs}>
            {tabs.map((item, idx) => (
              <li
                data-value={item.value}
                onClick={() => changeTabHandler(item.value)}
                key={item.value}
                className={currentTab === item.value ? classes.tabFocus : ''}
              >
                {item.name}
              </li>
            ))}
          </ul>
          <div className={classes.inputArea}>
            <div className={classes.eachInput}>
              <Input
                type="text"
                id="account"
                label='電子郵件'
                value={email}
                prependIcon={mdiEmail}
                onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className={classes.eachInput}>
              <div className={classes.passwordContainer}>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  label="密碼"
                  value={password}
                  appendIcon={showPassword ? mdiEyeOff : mdiEye}
                  prependIcon={mdiAccountKey}
                  onAppendClick={togglePasswordVisibility}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {warning && <p className={classes.warning}>{warning}</p>}
            {currentTab === 'logIn' && (
              <Button type="button" classBtn={btnClass} clickEvent={loginHandler} disabled={!email || !password}>
                登入
              </Button>
            )}
            {currentTab === 'signUp' && (
              <Button type="button" classBtn={btnClass} clickEvent={registerHandler} disabled={!email || !password}>
                註冊
              </Button>
            )}
          </div>
        </form>
        <div className={classes.copyright}>All right reserved Frontend Discussion</div>
      </div>
    </div>
  )
}
export default Authentication
