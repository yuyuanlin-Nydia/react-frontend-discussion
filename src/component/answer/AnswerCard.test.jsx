import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import AnswerCard from './AnswerCard'
import { renderWithStore } from '../../test/renderWithStore'
import { editAnswer, deleteAnswer } from '../../store/answer-action'

vi.mock('../../store/answer-action', () => ({
  editAnswer: vi.fn(() => Promise.resolve()),
  deleteAnswer: vi.fn(() => Promise.resolve())
}))

const owner = { isLogin: true, email: 'me@test.com', displayName: 'Me' }
const answerData = {
  id: 'a1',
  author: 'Me',
  email: 'me@test.com',
  answer: '原本的回答',
  time: new Date(2026, 0, 2, 3, 4).toISOString()
}

const renderCard = (auth, data = answerData, props = {}) =>
  renderWithStore(<AnswerCard answerData={data} {...props} />, { auth })

describe('AnswerCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('顯示回答內容與建立時間（time 欄位）', () => {
    renderCard()
    expect(screen.getByText('原本的回答')).toBeInTheDocument()
    expect(screen.getByText('2026-01-02 03:04')).toBeInTheDocument()
  })

  it('有 updateTime 時顯示更新時間', () => {
    renderCard(undefined, { ...answerData, updateTime: new Date(2026, 1, 3, 4, 5).toISOString() })
    expect(screen.getByText('2026-02-03 04:05 更新')).toBeInTheDocument()
  })

  it('未登入時不顯示任何操作按鈕', () => {
    renderCard(undefined, answerData, { onReply: vi.fn() })
    expect(screen.queryByText('回覆')).not.toBeInTheDocument()
    expect(screen.queryByText('編輯')).not.toBeInTheDocument()
    expect(screen.queryByText('刪除')).not.toBeInTheDocument()
  })

  it('作者本人可看到編輯與刪除', () => {
    renderCard(owner)
    expect(screen.getByText('編輯')).toBeInTheDocument()
    expect(screen.getByText('刪除')).toBeInTheDocument()
  })

  it('其他使用者看不到編輯與刪除', () => {
    renderCard({ isLogin: true, email: 'other@test.com', displayName: 'Other' })
    expect(screen.queryByText('編輯')).not.toBeInTheDocument()
    expect(screen.queryByText('刪除')).not.toBeInTheDocument()
  })

  it('email 不同時即使名稱相同也不是作者', () => {
    renderCard({ isLogin: true, email: 'other@test.com', displayName: 'Me' })
    expect(screen.queryByText('編輯')).not.toBeInTheDocument()
  })

  it('舊資料沒有作者與 email 時，沒有名稱的使用者不會被當成作者', () => {
    renderCard(
      { isLogin: true, email: 'x@test.com', displayName: null },
      { ...answerData, author: undefined, email: undefined }
    )
    expect(screen.queryByText('編輯')).not.toBeInTheDocument()
  })

  it('舊資料沒有 email 時以作者名稱判斷', () => {
    renderCard(owner, { ...answerData, email: undefined })
    expect(screen.getByText('編輯')).toBeInTheDocument()
  })

  it('點擊回覆會以作者名稱呼叫 onReply', () => {
    const onReply = vi.fn()
    renderCard(owner, answerData, { onReply })
    fireEvent.click(screen.getByText('回覆'))
    expect(onReply).toHaveBeenCalledWith('Me')
  })

  it('編輯：送出修剪後的內容、顯示提示並通知重新載入', async () => {
    const onChange = vi.fn()
    const { store } = renderCard(owner, answerData, { onChange })

    fireEvent.click(screen.getByText('編輯'))
    const textarea = screen.getByLabelText('編輯回覆')
    expect(textarea).toHaveValue('原本的回答')
    fireEvent.change(textarea, { target: { value: '  第一行\n第二行  ' } })
    fireEvent.click(screen.getByText('確認'))

    await waitFor(() => expect(onChange).toHaveBeenCalled())
    expect(editAnswer).toHaveBeenCalledWith('q1', 'a1', '第一行\n第二行')
    expect(store.getState().snackbar.message).toBe('已成功更新回覆!')
    expect(screen.queryByLabelText('編輯回覆')).not.toBeInTheDocument()
  })

  it('編輯：內容為空白時不送出', () => {
    renderCard(owner)
    fireEvent.click(screen.getByText('編輯'))
    fireEvent.change(screen.getByLabelText('編輯回覆'), { target: { value: '   ' } })
    fireEvent.click(screen.getByText('確認'))
    expect(editAnswer).not.toHaveBeenCalled()
  })

  it('編輯：內容未變更時直接關閉，不呼叫 API', () => {
    renderCard(owner)
    fireEvent.click(screen.getByText('編輯'))
    fireEvent.click(screen.getByText('確認'))
    expect(editAnswer).not.toHaveBeenCalled()
    expect(screen.queryByLabelText('編輯回覆')).not.toBeInTheDocument()
  })

  it('編輯：取消後恢復原內容', () => {
    renderCard(owner)
    fireEvent.click(screen.getByText('編輯'))
    fireEvent.change(screen.getByLabelText('編輯回覆'), { target: { value: '改到一半' } })
    fireEvent.click(screen.getByText('取消編輯'))
    expect(screen.getByText('原本的回答')).toBeInTheDocument()
    fireEvent.click(screen.getByText('編輯'))
    expect(screen.getByLabelText('編輯回覆')).toHaveValue('原本的回答')
  })

  it('編輯失敗時顯示錯誤並保持編輯狀態', async () => {
    editAnswer.mockRejectedValueOnce(new Error('API Error'))
    const onChange = vi.fn()
    const { store } = renderCard(owner, answerData, { onChange })

    fireEvent.click(screen.getByText('編輯'))
    fireEvent.change(screen.getByLabelText('編輯回覆'), { target: { value: '新內容' } })
    fireEvent.click(screen.getByText('確認'))

    await waitFor(() => expect(store.getState().snackbar.message).toBe('更新失敗，請稍後再試'))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByLabelText('編輯回覆')).toBeInTheDocument()
  })

  it('刪除：確認後刪除並通知重新載入', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const onChange = vi.fn()
    const { store } = renderCard(owner, answerData, { onChange })

    fireEvent.click(screen.getByText('刪除'))

    await waitFor(() => expect(onChange).toHaveBeenCalled())
    expect(deleteAnswer).toHaveBeenCalledWith('q1', 'a1')
    expect(store.getState().snackbar.message).toBe('已成功刪除回覆!')
  })

  it('刪除：取消確認則不刪除', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderCard(owner)
    fireEvent.click(screen.getByText('刪除'))
    expect(deleteAnswer).not.toHaveBeenCalled()
  })

  it('刪除失敗時顯示錯誤', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    deleteAnswer.mockRejectedValueOnce(new Error('API Error'))
    const onChange = vi.fn()
    const { store } = renderCard(owner, answerData, { onChange })

    fireEvent.click(screen.getByText('刪除'))

    await waitFor(() => expect(store.getState().snackbar.message).toBe('刪除失敗，請稍後再試'))
    expect(onChange).not.toHaveBeenCalled()
  })
})
