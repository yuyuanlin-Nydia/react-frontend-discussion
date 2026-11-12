import '@testing-library/jest-dom'
import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Modal 透過 portal 渲染到 #modal-root（正式環境定義於 index.html）
beforeEach(() => {
  if (!document.getElementById('modal-root')) {
    const modalRoot = document.createElement('div')
    modalRoot.id = 'modal-root'
    document.body.appendChild(modalRoot)
  }
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})
