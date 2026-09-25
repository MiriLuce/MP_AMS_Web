import { describe, expect, it } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('reorders an ISO date without shifting the day', () => {
    expect(formatDate('1993-10-01')).toBe('01/10/1993')
  })

  it('shows a dash when there is no date', () => {
    expect(formatDate(null)).toBe('—')
  })
})
