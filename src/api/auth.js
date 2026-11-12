import { getSession, updateTokens, clearSession } from '../lib/authStorage'
import store from '../store/index'
import { authAction } from '../store/auth-slice'

const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY
// 提前 60 秒視為過期，避免請求途中 token 失效
const EXPIRY_MARGIN = 60 * 1000

export class AuthExpiredError extends Error {
  constructor () {
    super('登入已過期，請重新登入')
    this.code = 'AUTH_EXPIRED'
  }
}

function expireSession () {
  clearSession()
  store.dispatch(authAction.logout())
}

async function refreshIdToken (refreshToken) {
  const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken })
  })
  if (!response.ok) {
    expireSession()
    throw new AuthExpiredError()
  }
  const data = await response.json()
  updateTokens({ idToken: data.id_token, refreshToken: data.refresh_token, expiresIn: data.expires_in })
  return data.id_token
}

let pendingRefresh = null

// 取得有效的 idToken：未過期直接回傳，過期則以 refreshToken 換新；無法換新時登出並拋出 AuthExpiredError
export async function getValidIdToken () {
  const { idToken, refreshToken, expiresAt } = getSession()
  if (idToken && Date.now() < expiresAt - EXPIRY_MARGIN) return idToken
  if (!refreshToken) {
    expireSession()
    throw new AuthExpiredError()
  }
  // 同時有多個請求時只換一次 token
  if (!pendingRefresh) {
    pendingRefresh = refreshIdToken(refreshToken).finally(() => {
      pendingRefresh = null
    })
  }
  return pendingRefresh
}
