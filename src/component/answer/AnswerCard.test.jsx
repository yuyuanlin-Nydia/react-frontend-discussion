import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor, within } from '@testing-library/react'
import AnswerCard from './AnswerCard'
import { renderWithStore } from '../../test/renderWithStore'
import { editAnswer, deleteAnswer, addReply, editReply, deleteReply } from '../../store/answer-action'

vi.mock('../../store/answer-action', () => ({
  editAnswer: vi.fn(() => Promise.resolve()),
  deleteAnswer: vi.fn(() => Promise.resolve()),
  addReply: vi.fn(() => Promise.resolve()),
  editReply: vi.fn(() => Promise.resolve()),
  deleteReply: vi.fn(() => Promise.resolve())
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

const openDeleteDialog = () => {
  fireEvent.click(screen.getByText('刪除'))
  return screen.getByRole('alertdialog')
}

describe('AnswerCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('顯示', () => {
    it('顯示回答內容與建立時間（time 欄位）', () => {
      renderCard()
      expect(screen.getByText('原本的回答')).toBeInTheDocument()
      expect(screen.getByText('2026-01-02 03:04')).toBeInTheDocument()
    })

    it('舊資料以 createTime 作為建立時間', () => {
      renderCard(undefined, { ...answerData, time: undefined, createTime: new Date(2025, 4, 6, 7, 8).toISOString() })
      expect(screen.getByText('2025-05-06 07:08')).toBeInTheDocument()
    })

    it('有 updateTime 時顯示更新時間', () => {
      renderCard(undefined, { ...answerData, updateTime: new Date(2026, 1, 3, 4, 5).toISOString() })
      expect(screen.getByText('2026-02-03 04:05 更新')).toBeInTheDocument()
    })
  })

  describe('權限', () => {
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
  })

  it('留言串中的回覆：點擊回覆會以作者名稱呼叫 onReply', () => {
    const onReply = vi.fn()
    renderCard(owner, answerData, { parentId: 'p1', onReply })
    fireEvent.click(screen.getByText('回覆'))
    expect(onReply).toHaveBeenCalledWith('Me')
  })

  describe('留言串', () => {
    const other = { isLogin: true, email: 'other@test.com', displayName: 'Other' }
    const threadData = {
      ...answerData,
      replies: [
        { id: 'r1', author: 'Bob', email: 'bob@test.com', answer: '第一則回覆', time: new Date(2026, 0, 3).toISOString() },
        { id: 'r2', author: 'Other', email: 'other@test.com', answer: '第二則回覆', time: new Date(2026, 0, 4).toISOString() }
      ]
    }

    beforeEach(() => {
      window.HTMLElement.prototype.scrollIntoView = vi.fn()
    })

    it('在回答底下依序顯示回覆', () => {
      renderCard(undefined, threadData)
      const texts = screen.getAllByText(/則回覆$/).map((el) => el.textContent)
      expect(texts).toEqual(['第一則回覆', '第二則回覆'])
    })

    it('點擊回答的回覆，在該留言串底下開啟回覆框並聚焦', () => {
      renderCard(other, threadData)
      expect(screen.queryByLabelText('回覆 Me')).not.toBeInTheDocument()
      fireEvent.click(screen.getAllByText('回覆')[0])
      const textarea = screen.getByLabelText('回覆 Me')
      expect(textarea).toHaveValue('')
      expect(textarea).toHaveFocus()
    })

    it('點擊串中某則回覆的回覆，在同一個回覆框加上 @作者', () => {
      renderCard(other, threadData)
      // [0] 為回答本身，[1] 為 Bob 的回覆
      fireEvent.click(screen.getAllByText('回覆')[1])
      const textarea = screen.getByLabelText('回覆 Me')
      expect(textarea).toHaveValue('@Bob ')

      // 重複點擊不會重複加上
      fireEvent.click(screen.getAllByText('回覆')[1])
      expect(textarea).toHaveValue('@Bob ')
    })

    it('送出回覆：寫入該回答底下、關閉回覆框並重新載入', async () => {
      const onChange = vi.fn()
      const { store } = renderCard(other, threadData, { onChange })
      fireEvent.click(screen.getAllByText('回覆')[0])
      fireEvent.change(screen.getByLabelText('回覆 Me'), { target: { value: '  同意  ' } })
      fireEvent.click(screen.getByText('送出回覆'))

      await waitFor(() => expect(onChange).toHaveBeenCalled())
      expect(addReply).toHaveBeenCalledWith(
        expect.objectContaining({ answer: '同意', author: 'Other', email: 'other@test.com' }),
        'q1',
        'a1'
      )
      expect(store.getState().snackbar.message).toBe('已成功新增回覆!')
      expect(screen.queryByLabelText('回覆 Me')).not.toBeInTheDocument()
    })

    it('回覆內容空白時不送出，取消會關閉回覆框', () => {
      renderCard(other, threadData)
      fireEvent.click(screen.getAllByText('回覆')[0])
      fireEvent.change(screen.getByLabelText('回覆 Me'), { target: { value: '   ' } })
      fireEvent.click(screen.getByText('送出回覆'))
      expect(addReply).not.toHaveBeenCalled()

      fireEvent.click(screen.getByText('取消回覆'))
      expect(screen.queryByLabelText('回覆 Me')).not.toBeInTheDocument()
    })

    it('送出失敗時保留內容並顯示錯誤', async () => {
      addReply.mockRejectedValueOnce(Object.assign(new Error(), { status: 401 }))
      const onChange = vi.fn()
      const { store } = renderCard(other, threadData, { onChange })
      fireEvent.click(screen.getAllByText('回覆')[0])
      fireEvent.change(screen.getByLabelText('回覆 Me'), { target: { value: '同意' } })
      fireEvent.click(screen.getByText('送出回覆'))

      await waitFor(() => expect(store.getState().snackbar.message).toBe('沒有權限執行此操作'))
      expect(onChange).not.toHaveBeenCalled()
      expect(screen.getByLabelText('回覆 Me')).toHaveValue('同意')
    })

    it('只能編輯／刪除自己的回覆，並呼叫回覆專用的 action', async () => {
      const onChange = vi.fn()
      renderCard(other, threadData, { onChange })
      // 回答不是自己的，只有 r2 是
      expect(screen.getAllByText('編輯')).toHaveLength(1)

      fireEvent.click(screen.getByText('編輯'))
      fireEvent.change(screen.getByLabelText('編輯回覆'), { target: { value: '改過的回覆' } })
      fireEvent.click(screen.getByText('確認'))
      await waitFor(() => expect(editReply).toHaveBeenCalledWith('q1', 'a1', 'r2', '改過的回覆'))
      expect(editAnswer).not.toHaveBeenCalled()

      fireEvent.click(within(openDeleteDialog()).getByRole('button', { name: '刪除' }))
      await waitFor(() => expect(deleteReply).toHaveBeenCalledWith('q1', 'a1', 'r2'))
      expect(deleteAnswer).not.toHaveBeenCalled()
    })

    it('刪除有回覆的回答時提示回覆會一併刪除', () => {
      renderCard(owner, threadData)
      expect(within(openDeleteDialog()).getByText(/底下的 2 則回覆也會一併刪除/)).toBeInTheDocument()
    })
  })

  describe('編輯', () => {
    it('送出修剪後的內容、顯示提示並通知重新載入', async () => {
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

    it('內容為空白時不送出', () => {
      renderCard(owner)
      fireEvent.click(screen.getByText('編輯'))
      fireEvent.change(screen.getByLabelText('編輯回覆'), { target: { value: '   ' } })
      fireEvent.click(screen.getByText('確認'))
      expect(editAnswer).not.toHaveBeenCalled()
    })

    it('內容未變更時直接關閉，不呼叫 API', () => {
      renderCard(owner)
      fireEvent.click(screen.getByText('編輯'))
      fireEvent.click(screen.getByText('確認'))
      expect(editAnswer).not.toHaveBeenCalled()
      expect(screen.queryByLabelText('編輯回覆')).not.toBeInTheDocument()
    })

    it('取消後恢復原內容', () => {
      renderCard(owner)
      fireEvent.click(screen.getByText('編輯'))
      fireEvent.change(screen.getByLabelText('編輯回覆'), { target: { value: '改到一半' } })
      fireEvent.click(screen.getByText('取消編輯'))
      expect(screen.getByText('原本的回答')).toBeInTheDocument()
      fireEvent.click(screen.getByText('編輯'))
      expect(screen.getByLabelText('編輯回覆')).toHaveValue('原本的回答')
    })

    it('失敗時顯示錯誤並保持編輯狀態', async () => {
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
  })

  describe('刪除', () => {
    it('點擊刪除先顯示確認視窗，焦點在「取消」', () => {
      renderCard(owner)
      const dialog = openDeleteDialog()
      expect(within(dialog).getByText('確定要刪除這則回覆嗎？刪除後無法復原。')).toBeInTheDocument()
      expect(within(dialog).getByRole('button', { name: '取消' })).toHaveFocus()
      expect(deleteAnswer).not.toHaveBeenCalled()
    })

    it('確認後刪除、關閉視窗並通知重新載入', async () => {
      const onChange = vi.fn()
      const { store } = renderCard(owner, answerData, { onChange })

      fireEvent.click(within(openDeleteDialog()).getByRole('button', { name: '刪除' }))

      await waitFor(() => expect(onChange).toHaveBeenCalled())
      expect(deleteAnswer).toHaveBeenCalledWith('q1', 'a1')
      expect(store.getState().snackbar.message).toBe('已成功刪除回覆!')
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })

    it('刪除進行中按鈕停用並顯示處理中，不會重複送出', async () => {
      let resolveDelete
      deleteAnswer.mockImplementationOnce(() => new Promise((resolve) => { resolveDelete = resolve }))
      renderCard(owner, answerData, { onChange: vi.fn() })

      const dialog = openDeleteDialog()
      fireEvent.click(within(dialog).getByRole('button', { name: '刪除' }))
      const loadingBtn = await within(dialog).findByRole('button', { name: '處理中...' })
      expect(loadingBtn).toBeDisabled()
      expect(within(dialog).getByRole('button', { name: '取消' })).toBeDisabled()
      fireEvent.click(loadingBtn)
      expect(deleteAnswer).toHaveBeenCalledTimes(1)

      resolveDelete()
      await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    })

    it('按取消、Esc 或點擊背景都會關閉且不刪除', () => {
      renderCard(owner)

      fireEvent.click(within(openDeleteDialog()).getByRole('button', { name: '取消' }))
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()

      openDeleteDialog()
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()

      openDeleteDialog()
      fireEvent.click(document.querySelector('[class*="modalWrapper"]'))
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()

      expect(deleteAnswer).not.toHaveBeenCalled()
    })

    it('失敗時顯示錯誤、保留視窗以便重試', async () => {
      deleteAnswer.mockRejectedValueOnce(new Error('API Error'))
      const onChange = vi.fn()
      const { store } = renderCard(owner, answerData, { onChange })

      const dialog = openDeleteDialog()
      fireEvent.click(within(dialog).getByRole('button', { name: '刪除' }))

      await waitFor(() => expect(store.getState().snackbar.message).toBe('刪除失敗，請稍後再試'))
      expect(onChange).not.toHaveBeenCalled()
      expect(within(dialog).getByRole('button', { name: '刪除' })).toBeEnabled()
    })

    it('沒有權限（401）時顯示權限錯誤', async () => {
      deleteAnswer.mockRejectedValueOnce(Object.assign(new Error('Permission denied'), { status: 401 }))
      const { store } = renderCard(owner, answerData, { onChange: vi.fn() })

      fireEvent.click(within(openDeleteDialog()).getByRole('button', { name: '刪除' }))

      await waitFor(() => expect(store.getState().snackbar.message).toBe('沒有權限執行此操作'))
    })

    it('登入過期時提示重新登入', async () => {
      deleteAnswer.mockRejectedValueOnce(Object.assign(new Error(), { code: 'AUTH_EXPIRED' }))
      const { store } = renderCard(owner, answerData, { onChange: vi.fn() })

      fireEvent.click(within(openDeleteDialog()).getByRole('button', { name: '刪除' }))

      await waitFor(() => expect(store.getState().snackbar.message).toBe('登入已過期，請重新登入'))
    })

    it('回答已刪除但回答數量更新失敗時，顯示警告並重新載入', async () => {
      deleteAnswer.mockRejectedValueOnce(Object.assign(new Error(), { code: 'ANSWER_COUNT_SYNC' }))
      const onChange = vi.fn()
      const { store } = renderCard(owner, answerData, { onChange })

      fireEvent.click(within(openDeleteDialog()).getByRole('button', { name: '刪除' }))

      await waitFor(() => expect(onChange).toHaveBeenCalled())
      expect(store.getState().snackbar.message).toBe('回覆已刪除，但回答數量更新失敗')
      expect(store.getState().snackbar.bgColor).toBe('var(--warning)')
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })
})
