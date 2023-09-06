import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = {
  isLogin: false,
  userAccount: null,
  idToken: null,
  displayName: null,
  refreshToken: null
}
const updateProfileHandler = async (idToken, userAccount) => {
  const response = await fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCYMgs7g9s73a3DTLuMFDhs2q1y3Mk85kg',
    {
      method: 'POST',
      body: JSON.stringify({
        idToken,
        displayName: userAccount,
        photoUrl: '',
        returnSecureToken: true
      })
    }
  )
  const data = await response.json()
  console.log(data)
}
const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    logHandler (state, action) {
      state.isLogin = action.payload.isLogin
      state.userAccount = action.payload.loginData.email.split('@')[0]
      state.idToken = action.payload.loginData.idToken
      updateProfileHandler(state.idToken, state.userAccount)
    }
  }
})
export default authSlice.reducer
export const authAction = authSlice.actions
