import { createSlice } from '@reduxjs/toolkit'

const storedToken = localStorage.getItem('idToken')
const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

const initialAuthState = {
  isLogin: !!storedToken,
  userAccount: storedUserInfo.userAccount || null,
  idToken: storedToken || null,
  displayName: storedUserInfo.displayName || null
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
      return {
        ...state,
        ...initialAuthState
      }
    }
  }
})

export default authSlice.reducer
export const authAction = authSlice.actions
