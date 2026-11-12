import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getValidIdToken } from './auth'
import { getSession } from '../lib/authStorage'
import store from '../store/index'
import { authAction } from '../store/auth-slice'
import { loginForTest, okResponse, errorResponse } from '../test/session'

describe('getValidIdToken', () => {
  let fetchMock
  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    store.dispatch(authAction.logHandler({ loginData: { idToken: 'x', email: 'me@test.com', displayName: 'Me' } }))
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('token 未過期時直接回傳，不呼叫 API', async () => {
    loginForTest({ idToken: 'still-valid' })
    await expect(getValidIdToken()).resolves.toBe('still-valid')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('token 過期時以 refreshToken 換新並儲存', async () => {
    loginForTest({ idToken: 'old', refreshToken: 'r1', expiresIn: '0' })
    fetchMock.mockImplementation(() => okResponse({ id_token: 'new', refresh_token: 'r2', expires_in: '3600' }))

    await expect(getValidIdToken()).resolves.toBe('new')

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toContain('securetoken.googleapis.com/v1/token')
    expect(options.body.get('grant_type')).toBe('refresh_token')
    expect(options.body.get('refresh_token')).toBe('r1')
    const session = getSession()
    expect(session.idToken).toBe('new')
    expect(session.refreshToken).toBe('r2')
    expect(session.expiresAt).toBeGreaterThan(Date.now() + 3500 * 1000)
  })

  it('同時多個請求只換一次 token', async () => {
    loginForTest({ expiresIn: '0' })
    fetchMock.mockImplementation(() => okResponse({ id_token: 'new', refresh_token: 'r2', expires_in: '3600' }))

    const tokens = await Promise.all([getValidIdToken(), getValidIdToken(), getValidIdToken()])
    expect(tokens).toEqual(['new', 'new', 'new'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('換新失敗時清除登入資訊、登出並拋出 AUTH_EXPIRED', async () => {
    loginForTest({ expiresIn: '0' })
    fetchMock.mockImplementation(() => errorResponse(400, 'TOKEN_EXPIRED'))

    await expect(getValidIdToken()).rejects.toMatchObject({ code: 'AUTH_EXPIRED' })
    expect(getSession().idToken).toBeNull()
    expect(store.getState().auth.isLogin).toBe(false)
  })

  it('沒有 refreshToken（未登入或舊版登入資料）時拋出 AUTH_EXPIRED', async () => {
    localStorage.setItem('idToken', 'legacy-token')

    await expect(getValidIdToken()).rejects.toMatchObject({ code: 'AUTH_EXPIRED' })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(store.getState().auth.isLogin).toBe(false)
  })
})
