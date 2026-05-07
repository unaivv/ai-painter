import { describe, it, expect, vi } from 'vitest'
import { instruct } from './instruct-painter'
import { createGrid } from '@/domain/canvas/CanvasGrid'

const makeComplete = (response: string) =>
  vi.fn().mockResolvedValue(response)

describe('instruct', () => {
  it('calls complete with system prompt containing ASCII snapshot', async () => {
    const grid = createGrid(16)
    const completeMock = makeComplete('[]')

    await instruct(grid, 'add a red pixel', completeMock)

    expect(completeMock).toHaveBeenCalledOnce()
    const [system] = completeMock.mock.calls[0]
    expect(system).toContain('ASCII')
  })

  it('valid JSON response → { ok: true, value: PixelInstruction[] }', async () => {
    const grid = createGrid(16)
    const completeMock = makeComplete('[{"x":0,"y":0,"color":"#ff004d"}]')

    const result = await instruct(grid, 'add red pixel', completeMock)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual([{ x: 0, y: 0, color: '#ff004d' }])
    }
  })

  it('bad JSON response → { ok: false, error: string }', async () => {
    const grid = createGrid(16)
    const completeMock = makeComplete('not valid json at all')

    const result = await instruct(grid, 'do something', completeMock)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(typeof result.error).toBe('string')
    }
  })

  it('empty array [] → { ok: true, value: [] }', async () => {
    const grid = createGrid(16)
    const completeMock = makeComplete('[]')

    const result = await instruct(grid, 'nothing to change', completeMock)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual([])
    }
  })

  it('passes maxTokens=256 to complete', async () => {
    const grid = createGrid(16)
    const completeMock = makeComplete('[]')

    await instruct(grid, 'test', completeMock)

    const [, , maxTokens] = completeMock.mock.calls[0]
    expect(maxTokens).toBe(256)
  })
})
