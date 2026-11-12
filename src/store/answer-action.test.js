import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { addAnswer, editAnswer, deleteAnswer, addReply, editReply, deleteReply, transformReplies } from './answer-action'
import { loginForTest, okResponse, errorResponse } from '../test/session'

import { BASE_URL } from '../api/client'

// 去掉 BASE_URL 與查詢字串，只留路徑（沒有 .env 時 BASE_URL 為 undefined，同樣適用）
const pathOf = (url) => url.split('?')[0].slice(String(BASE_URL).length)
const countBody = (call) => JSON.parse(call[1].body)

describe('answer-action', () => {
  let fetchMock
  beforeEach(() => {
    fetchMock = vi.fn(() => okResponse())
    vi.stubGlobal('fetch', fetchMock)
    loginForTest()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('editAnswer 以 PATCH 只更新 answer 與 updateTime，不覆蓋其他欄位', async () => {
    await editAnswer('q1', 'a1', '新內容')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(pathOf(url)).toBe('/answers/q1/a1.json')
    expect(options.method).toBe('PATCH')
    const body = JSON.parse(options.body)
    expect(Object.keys(body).sort()).toEqual(['answer', 'updateTime'])
    expect(body.answer).toBe('新內容')
  })

  it('addAnswer 新增回答並將回答數 +1', async () => {
    await addAnswer({ answer: 'hi' }, 'q1')

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(pathOf(fetchMock.mock.calls[0][0])).toBe('/answers/q1.json')
    expect(fetchMock.mock.calls[0][1].method).toBe('POST')
    expect(pathOf(fetchMock.mock.calls[1][0])).toBe('/questions/q1.json')
    expect(countBody(fetchMock.mock.calls[1])).toEqual({ answers: { '.sv': { increment: 1 } } })
  })

  it('deleteAnswer 刪除回答並將回答數 -1', async () => {
    await deleteAnswer('q1', 'a1')

    expect(fetchMock).toHaveBeenCalledTimes(2)
    const [deleteUrl, deleteOptions] = fetchMock.mock.calls[0]
    expect(pathOf(deleteUrl)).toBe('/answers/q1/a1.json')
    expect(deleteOptions.method).toBe('DELETE')

    const [countUrl, countOptions] = fetchMock.mock.calls[1]
    expect(pathOf(countUrl)).toBe('/questions/q1.json')
    expect(countOptions.method).toBe('PATCH')
    expect(countBody(fetchMock.mock.calls[1])).toEqual({ answers: { '.sv': { increment: -1 } } })
  })

  it('刪除失敗時拋出錯誤且不更新回答數', async () => {
    fetchMock.mockImplementationOnce(() => errorResponse(401))

    await expect(deleteAnswer('q1', 'a1')).rejects.toMatchObject({ status: 401 })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('回答數更新失敗時重試一次，成功則不拋錯', async () => {
    fetchMock
      .mockImplementationOnce(() => okResponse()) // DELETE
      .mockImplementationOnce(() => errorResponse(500)) // 第一次更新數量

    await expect(deleteAnswer('q1', 'a1')).resolves.toBeUndefined()
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  describe('留言串回覆', () => {
    it('addReply 新增至該回答的 replies 底下，且不更新回答數', async () => {
      await addReply({ answer: 'hi', email: 'me@test.com' }, 'q1', 'a1')

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(pathOf(fetchMock.mock.calls[0][0])).toBe('/answers/q1/a1/replies.json')
      expect(fetchMock.mock.calls[0][1].method).toBe('POST')
    })

    it('editReply 以 PATCH 只更新 answer 與 updateTime', async () => {
      await editReply('q1', 'a1', 'r1', '新內容')

      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [url, options] = fetchMock.mock.calls[0]
      expect(pathOf(url)).toBe('/answers/q1/a1/replies/r1.json')
      expect(options.method).toBe('PATCH')
      expect(Object.keys(JSON.parse(options.body)).sort()).toEqual(['answer', 'updateTime'])
    })

    it('deleteReply 刪除該則回覆，且不更新回答數', async () => {
      await deleteReply('q1', 'a1', 'r1')

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(pathOf(fetchMock.mock.calls[0][0])).toBe('/answers/q1/a1/replies/r1.json')
      expect(fetchMock.mock.calls[0][1].method).toBe('DELETE')
    })

    it('transformReplies 轉成陣列並依時間由舊到新排序', () => {
      expect(transformReplies(undefined)).toEqual([])
      const result = transformReplies({
        k2: { answer: '後', time: '2026-01-02T00:00:00.000Z' },
        k1: { answer: '先', time: '2026-01-01T00:00:00.000Z' }
      })
      expect(result.map((r) => r.id)).toEqual(['k1', 'k2'])
    })
  })

  it('回答數重試仍失敗時拋出 ANSWER_COUNT_SYNC', async () => {
    fetchMock
      .mockImplementationOnce(() => okResponse()) // DELETE
      .mockImplementation(() => errorResponse(500))

    await expect(deleteAnswer('q1', 'a1')).rejects.toMatchObject({ code: 'ANSWER_COUNT_SYNC' })
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})
