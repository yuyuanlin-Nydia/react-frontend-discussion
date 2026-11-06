import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import AnswerList from './AnswerList'
import { renderWithStore } from '../../test/renderWithStore'

const answers = [
  { id: 'a1', author: 'Alice', email: 'alice@test.com', answer: '回答一', time: new Date().toISOString() },
  { id: 'a2', author: 'Bob', email: 'bob@test.com', answer: '回答二', time: new Date().toISOString() }
]
const user = { isLogin: true, email: 'me@test.com', displayName: 'Me' }

const renderList = (auth = user) =>
  renderWithStore(
    <AnswerList answerData={answers} onSubmitSuccess={vi.fn()} isAnswerLoading={false} />,
    { auth }
  )

describe('AnswerList', () => {
  it('點擊回覆會在輸入框加上 @作者 並聚焦', () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
    renderList()

    fireEvent.click(screen.getAllByText('回覆')[0])
    const textarea = screen.getByLabelText('Your Reply')
    expect(textarea).toHaveValue('@Alice ')
    expect(textarea).toHaveFocus()

    // 重複點擊同一位作者不會重複加上
    fireEvent.click(screen.getAllByText('回覆')[0])
    expect(textarea).toHaveValue('@Alice ')

    // 保留已輸入的內容
    fireEvent.change(textarea, { target: { value: '我的想法' } })
    fireEvent.click(screen.getAllByText('回覆')[1])
    expect(textarea).toHaveValue('@Bob 我的想法')
  })

  it('未登入時不顯示回覆區塊與回覆按鈕', () => {
    renderList({ isLogin: false })
    expect(screen.queryByLabelText('Your Reply')).not.toBeInTheDocument()
    expect(screen.queryByText('回覆')).not.toBeInTheDocument()
  })
})
