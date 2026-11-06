import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { editAnswer, deleteAnswer } from './answer-action'

const okResponse = () => Promise.resolve({ ok: true, json: () => Promise.resolve(null) })

describe('answer-action', () => {
  let fetchMock
  beforeEach(() => {
    fetchMock = vi.fn(okResponse)
    vi.stubGlobal('fetch', fetchMock)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('editAnswer 以 PATCH 只更新 answer 與 updateTime，不覆蓋其他欄位', async () => {
    await editAnswer('q1', 'a1', '新內容')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toMatch(/\/answers\/q1\/a1\.json$/)
    expect(options.method).toBe('PATCH')
    const body = JSON.parse(options.body)
    expect(Object.keys(body).sort()).toEqual(['answer', 'updateTime'])
    expect(body.answer).toBe('新內容')
  })

  it('deleteAnswer 刪除回答並將問題回答數 -1', async () => {
    await deleteAnswer('q1', 'a1')

    expect(fetchMock).toHaveBeenCalledTimes(2)
    const [deleteUrl, deleteOptions] = fetchMock.mock.calls[0]
    expect(deleteUrl).toMatch(/\/answers\/q1\/a1\.json$/)
    expect(deleteOptions.method).toBe('DELETE')

    const [countUrl, countOptions] = fetchMock.mock.calls[1]
    expect(countUrl).toMatch(/\/questions\/q1\.json$/)
    expect(countOptions.method).toBe('PATCH')
    expect(JSON.parse(countOptions.body)).toEqual({ answers: { '.sv': { increment: -1 } } })
  })

  it('刪除失敗時拋出錯誤且不更新回答數', async () => {
    fetchMock.mockImplementationOnce(() => Promise.resolve({ ok: false }))

    await expect(deleteAnswer('q1', 'a1')).rejects.toThrow()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
