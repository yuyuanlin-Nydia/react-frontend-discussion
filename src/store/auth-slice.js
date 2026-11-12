import { createSlice } from '@reduxjs/toolkit'
import { getSession, clearSession } from '../lib/authStorage'

const { idToken, refreshToken, expiresAt, userInfo } = getSession()
// 有 refreshToken 才能在 token 過期後自動換新；舊版登入資料（沒有 refreshToken）視為已登出
const hasValidSession = !!idToken && (!!refreshToken || Date.now() < expiresAt)
if (!hasValidSession) clearSession()

const initialAuthState = {
  isLogin: hasValidSession,
  email: hasValidSession ? userInfo.email || null : null,
  idToken: hasValidSession ? idToken : null,
  displayName: hasValidSession ? userInfo.displayName || null : null
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    logHandler (state, action) {
      const { displayName, idToken, email } = action.payload.loginData
      state.isLogin = true
      state.idToken = idToken
      state.email = email
      state.displayName = displayName
    },
    logout (state) {
      state.isLogin = false
      state.idToken = null
      state.email = null
      state.displayName = null
    }
  }
})

export default authSlice.reducer
export const authAction = authSlice.actions
