import { describe, it, expect } from 'vitest'
import { parseAsciiGrid } from './parse-ascii-grid'

const codes = { R: '#ff0000', B: '#0000ff', G: '#00ff00' }

describe('parseAsciiGrid', () => {
  it('parses colored cells from a simple grid', () => {
    const result = parseAsciiGrid('R..\n.B.\n..G', codes)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toContainEqual({ x: 0, y: 0, color: '#ff0000' })
      expect(result.value).toContainEqual({ x: 1, y: 1, color: '#0000ff' })
      expect(result.value).toContainEqual({ x: 2, y: 2, color: '#00ff00' })
    }
  })

  it('ignores dot cells (transparent)', () => {
    const result = parseAsciiGrid('R.B', codes)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toHaveLength(2)
      expect(result.value.find(p => p.x === 1)).toBeUndefined()
    }
  })

  it('ignores non-grid lines (explanatory text with punctuation)', () => {
    const raw = 'Here is the pixel art:\nRRBB\n....\nGGRR'
    const result = parseAsciiGrid(raw, codes)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.some(p => p.y === 0)).toBe(true)
    }
  })

  it('strips <think> tags before parsing', () => {
    const raw = '<think>planning the dog layout</think>\nRRBB\nGGRR'
    const result = parseAsciiGrid(raw, codes)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.length).toBeGreaterThan(0)
    }
  })

  it('is case-insensitive', () => {
    const result = parseAsciiGrid('rRbB', codes)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toHaveLength(4)
    }
  })

  it('returns error when no grid rows found', () => {
    const result = parseAsciiGrid('', codes)
    expect(result.ok).toBe(false)
  })

  it('returns error when grid has no colored pixels', () => {
    const result = parseAsciiGrid('....\n....', codes)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('no colored pixels')
    }
  })
})
