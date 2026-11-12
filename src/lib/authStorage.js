// 統一管理 localStorage 中的登入資訊
const ID_TOKEN = 'idToken'
const REFRESH_TOKEN = 'refreshToken'
const EXPIRES_AT = 'tokenExpiresAt'
const USER_INFO = 'userInfo'

export function saveSession ({ idToken, refreshToken, expiresIn, email, displayName }) {
  updateTokens({ idToken, refreshToken, expiresIn })
  localStorage.setItem(USER_INFO, JSON.stringify({ email, displayName }))
}

// expiresIn 為 Firebase 回傳的秒數（字串）
export function updateTokens ({ idToken, refreshToken, expiresIn }) {
  localStorage.setItem(ID_TOKEN, idToken)
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN, refreshToken)
  localStorage.setItem(EXPIRES_AT, String(Date.now() + Number(expiresIn || 3600) * 1000))
}

export function getSession () {
  let userInfo = {}
  try {
    userInfo = JSON.parse(localStorage.getItem(USER_INFO) || '{}') || {}
  } catch (e) {}
  return {
    idToken: localStorage.getItem(ID_TOKEN),
    refreshToken: localStorage.getItem(REFRESH_TOKEN),
    expiresAt: Number(localStorage.getItem(EXPIRES_AT)) || 0,
    userInfo
  }
}

export function clearSession () {
  [ID_TOKEN, REFRESH_TOKEN, EXPIRES_AT, USER_INFO].forEach((key) => localStorage.removeItem(key))
}
