import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { request } from './client'
import { loginForTest, okResponse, errorResponse } from '../test/session'

const queryOf = (url) => new URL(url, 'http://localhost').searchParams

describe('request', () => {
  let fetchMock
  beforeEach(() => {
    fetchMock = vi.fn(() => okResponse({}))
    vi.stubGlobal('fetch', fetchMock)
    loginForTest({ idToken: 'my-token' })
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('GET 請求不附 token，字串參數自動加引號', async () => {
    await request('/answers/q1.json', { params: { orderBy: 'time', limitToLast: 5 } })
    const query = queryOf(fetchMock.mock.calls[0][0])
    expect(query.get('orderBy')).toBe('"time"')
    expect(query.get('limitToLast')).toBe('5')
    expect(query.has('auth')).toBe(false)
  })

  it('寫入請求附上 auth token（不加引號）', async () => {
    await request('/answers/q1.json', { method: 'POST', body: '{}' })
    expect(queryOf(fetchMock.mock.calls[0][0]).get('auth')).toBe('my-token')
  })

  it('auth: false 時寫入請求不附 token', async () => {
    await request('/questions/q1.json', { method: 'PATCH', body: '{}', auth: false })
    expect(queryOf(fetchMock.mock.calls[0][0]).has('auth')).toBe(false)
  })

  it('未登入時寫入請求拋出 AUTH_EXPIRED，且不送出請求', async () => {
    localStorage.clear()
    await expect(request('/answers/q1.json', { method: 'POST', body: '{}' }))
      .rejects.toMatchObject({ code: 'AUTH_EXPIRED' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('回應失敗時拋出帶有 status 與錯誤訊息的 ApiError', async () => {
    fetchMock.mockImplementationOnce(() => errorResponse(401, 'Permission denied'))
    await expect(request('/answers/q1/a1.json', { method: 'DELETE' }))
      .rejects.toMatchObject({ status: 401, message: 'Permission denied' })
  })
})
