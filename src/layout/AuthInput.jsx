import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authAction } from '../store/auth-slice'
import classes from './AuthInput.module.css'
import Button from '../UI/Button'

const AuthInput = () => {
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState('logIn')
  const [warning, setWarning] = useState('')
  const tabs = [
    { value: 'logIn', name: '登入' },
    { value: 'signUp', name: '註冊' }
  ]
  const dispatch = useDispatch()
  const emailRef = useRef()
  const passwordRef = useRef()
  const handleWarning = (msg) => {
    if (msg === 'EMAIL_EXISTS') {
      setWarning('此電子郵件已註冊過')
    } else if (msg === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
      setWarning('由於異常活動，我們已阻止來自此設備的所有請求。稍後再試。')
    } else if (
      msg === 'WEAK_PASSWORD : Password should be at least 6 characters'
    ) {
      setWarning('密碼必須至少6個字母')
    } else if (msg === 'INVALID_EMAIL') {
      setWarning('沒有此電子信箱，請註冊！')
    } else if (msg === 'INVALID_PASSWORD') {
      setWarning('密碼不正確，請重新輸入!')
    }
    console.log(warning)
  }
  const loginWithFireBase = async () => {
    let url

    if (currentTab === 'logIn') {
      // 登入
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCYMgs7g9s73a3DTLuMFDhs2q1y3Mk85kg'
    } else {
      // 註冊
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCYMgs7g9s73a3DTLuMFDhs2q1y3Mk85kg'
    }
    const emailInput = emailRef.current.value
    const passwordInput = passwordRef.current.value
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
          returnSecureToken: true
        })
      })
      console.log(response)
      const data = await response.json()
      if (!response.ok) {
        let errorMessage = 'Authenticaiton failed!'
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message
          handleWarning(errorMessage)
        }
        throw new Error(errorMessage)
      }

      if (currentTab === 'signUp') {
        alert('註冊成功，請重新登入!')

        setWarning('')
        setCurrentTab('logIn')
        emailRef.current.value = ''
        passwordRef.current.value = ''
      } else {
        const sendData = {
          isLogin: true,
          loginData: data
        }
        await dispatch(authAction.logHandler(sendData))

        navigate('/', { replace: true })
      }
      console.log(data)
    } catch (e) {
      console.log(e.message)
      handleWarning(e.message)
    }
  }
  const loginHandler = (e) => {
    e.preventDefault()
    loginWithFireBase()
  }
  const changeTabHandler = (value) => {
    emailRef.current.value = ''
    passwordRef.current.value = ''
    if (warning) {
      setWarning('')
    }
    setCurrentTab(value)
  }
  return (
    <form className={classes.userTypeArea} onSubmit={loginHandler}>
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
      <div className={classes.eachInput}>
        <label>信箱</label>
        <input type="text" id="account" ref={emailRef} />
      </div>
      <div className={classes.eachInput}>
        <label>密碼</label>
        <input type="password" id="password" ref={passwordRef} />
        <br />
      </div>
      {warning && <p className={classes.warning}>{warning}</p>}
      {currentTab === 'logIn' && (
        <Button type="submit" classBtn={classes.loginBtn}>
          登入
        </Button>
      )}
      {currentTab === 'signUp' && (
        <Button type="submit" classBtn={classes.loginBtn}>
          註冊
        </Button>
      )}
    </form>
  )
}
export default AuthInput
