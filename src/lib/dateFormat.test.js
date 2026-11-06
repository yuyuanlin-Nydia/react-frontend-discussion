import { describe, it, expect } from 'vitest'
import formatDate from './dateFormat'

describe('formatDate', () => {
  it('個位數的月、日、時、分補零', () => {
    expect(formatDate(new Date(2026, 8, 5, 7, 3))).toBe('2026-09-05 07:03')
  })

  it('兩位數不補零', () => {
    expect(formatDate(new Date(2026, 11, 25, 23, 59))).toBe('2026-12-25 23:59')
  })
})
