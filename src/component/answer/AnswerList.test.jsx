import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import AnswerList from './AnswerList'
import { renderWithStore } from '../../test/renderWithStore'
import { addAnswer } from '../../store/answer-action'

vi.mock('../../store/answer-action', () => ({
  addAnswer: vi.fn(() => Promise.resolve()),
  editAnswer: vi.fn(() => Promise.resolve()),
  deleteAnswer: vi.fn(() => Promise.resolve())
}))

const answers = [
  { id: 'a1', author: 'Alice', email: 'alice@test.com', answer: '回答一', time: new Date().toISOString() },
  { id: 'a2', author: 'Bob', email: 'bob@test.com', answer: '回答二', time: new Date().toISOString() }
]
const user = { isLogin: true, email: 'me@test.com', displayName: 'Me' }

const renderList = (auth = user, onSubmitSuccess = vi.fn()) =>
  renderWithStore(
    <AnswerList answerData={answers} onSubmitSuccess={onSubmitSuccess} isAnswerLoading={false} />,
    { auth }
  )

describe('AnswerList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  it('點擊回覆會在該回答的留言串底下開啟回覆框，不影響底部的回答輸入框', () => {
    renderList()

    fireEvent.click(screen.getAllByText('回覆')[1])
    expect(screen.getByLabelText('回覆 Bob')).toHaveFocus()
    expect(screen.queryByLabelText('回覆 Alice')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Your Reply')).toHaveValue('')
  })

  it('未登入時不顯示回覆區塊與回覆按鈕', () => {
    renderList({ isLogin: false })
    expect(screen.queryByLabelText('Your Reply')).not.toBeInTheDocument()
    expect(screen.queryByText('回覆')).not.toBeInTheDocument()
  })

  it('送出回覆：帶入作者與 email、清空輸入框並重新載入', async () => {
    const onSubmitSuccess = vi.fn()
    const { store } = renderList(user, onSubmitSuccess)

    fireEvent.change(screen.getByLabelText('Your Reply'), { target: { value: '  我的回答  ' } })
    fireEvent.click(screen.getByText('送出'))

    await waitFor(() => expect(onSubmitSuccess).toHaveBeenCalled())
    expect(addAnswer).toHaveBeenCalledWith(
      expect.objectContaining({ answer: '我的回答', author: 'Me', email: 'me@test.com' }),
      'q1'
    )
    expect(screen.getByLabelText('Your Reply')).toHaveValue('')
    expect(store.getState().snackbar.message).toBe('已成功新增回覆!')
  })

  it('只有空白時無法送出', () => {
    renderList()
    fireEvent.change(screen.getByLabelText('Your Reply'), { target: { value: '   ' } })
    expect(screen.getByText('送出').closest('button')).toBeDisabled()
  })

  it('送出失敗時保留輸入內容並顯示錯誤', async () => {
    addAnswer.mockRejectedValueOnce(Object.assign(new Error(), { status: 401 }))
    const onSubmitSuccess = vi.fn()
    const { store } = renderList(user, onSubmitSuccess)

    fireEvent.change(screen.getByLabelText('Your Reply'), { target: { value: '我的回答' } })
    fireEvent.click(screen.getByText('送出'))

    await waitFor(() => expect(store.getState().snackbar.message).toBe('沒有權限執行此操作'))
    expect(onSubmitSuccess).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Your Reply')).toHaveValue('我的回答')
  })

  it('回覆已送出但回答數量更新失敗時，顯示警告並重新載入', async () => {
    addAnswer.mockRejectedValueOnce(Object.assign(new Error(), { code: 'ANSWER_COUNT_SYNC' }))
    const onSubmitSuccess = vi.fn()
    const { store } = renderList(user, onSubmitSuccess)

    fireEvent.change(screen.getByLabelText('Your Reply'), { target: { value: '我的回答' } })
    fireEvent.click(screen.getByText('送出'))

    await waitFor(() => expect(onSubmitSuccess).toHaveBeenCalled())
    expect(store.getState().snackbar.message).toBe('回覆已送出，但回答數量更新失敗')
    expect(screen.getByLabelText('Your Reply')).toHaveValue('')
  })
})
