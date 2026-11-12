import { saveSession } from '../lib/authStorage'

// 在 localStorage 寫入一組有效的登入資訊
export function loginForTest ({ idToken = 'valid-token', refreshToken = 'refresh-token', expiresIn = '3600', email = 'me@test.com', displayName = 'Me' } = {}) {
  saveSession({ idToken, refreshToken, expiresIn, email, displayName })
}

export const okResponse = (body = null) => Promise.resolve({ ok: true, json: () => Promise.resolve(body) })
export const errorResponse = (status, error = 'Permission denied') =>
  Promise.resolve({ ok: false, status, json: () => Promise.resolve({ error }) })
