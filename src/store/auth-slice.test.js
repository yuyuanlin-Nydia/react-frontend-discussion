import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginForTest } from '../test/session'

// auth-slice 在載入時從 localStorage 還原狀態，因此每個測試重新載入模組
const loadInitialAuth = async () => {
  vi.resetModules()
  const { default: reducer } = await import('./auth-slice')
  return reducer(undefined, { type: '@@INIT' })
}

describe('auth-slice 初始狀態', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('有 refreshToken 時還原登入狀態與 email', async () => {
    loginForTest({ email: 'me@test.com', displayName: 'Me', expiresIn: '0' })
    const state = await loadInitialAuth()
    expect(state).toMatchObject({ isLogin: true, email: 'me@test.com', displayName: 'Me' })
  })

  it('舊版登入資料（沒有 refreshToken）視為登出並清除', async () => {
    localStorage.setItem('idToken', 'legacy')
    localStorage.setItem('userInfo', JSON.stringify({ email: 'me@test.com' }))
    const state = await loadInitialAuth()
    expect(state).toMatchObject({ isLogin: false, email: null })
    expect(localStorage.getItem('idToken')).toBeNull()
    expect(localStorage.getItem('userInfo')).toBeNull()
  })

  it('沒有登入資料時為登出狀態', async () => {
    const state = await loadInitialAuth()
    expect(state.isLogin).toBe(false)
  })
})
