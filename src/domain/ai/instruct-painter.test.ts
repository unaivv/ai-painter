import { describe, it, expect, vi } from 'vitest'
import { instruct } from './instruct-painter'
import { createGrid, applyInstructions } from '@/domain/canvas/CanvasGrid'

const makeComplete = (response: string) =>
  vi.fn().mockResolvedValue(response)

const nonEmptyGrid = () =>
  applyInstructions(createGrid(16), [{ x: 0, y: 0, color: '#ff004d' }])

describe('instruct', () => {
  it('calls complete once per invocation', async () => {
    const completeMock = makeComplete('[]')
    await instruct(nonEmptyGrid(), 'add a red pixel', completeMock)
    expect(completeMock).toHaveBeenCalledOnce()
  })

  it('valid JSON response → { ok: true, value: PixelInstruction[] }', async () => {
    const result = await instruct(nonEmptyGrid(), 'add red pixel', makeComplete('[{"x":0,"y":0,"color":"#ff004d"}]'))
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toEqual([{ x: 0, y: 0, color: '#ff004d' }])
  })

  it('bad JSON response → { ok: false, error: string }', async () => {
    const result = await instruct(nonEmptyGrid(), 'do something', makeComplete('not valid json at all'))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(typeof result.error).toBe('string')
  })

  it('empty array [] on non-empty grid → { ok: true, value: [] }', async () => {
    const result = await instruct(nonEmptyGrid(), 'nothing to change', makeComplete('[]'))
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toEqual([])
  })

  it('empty array [] on empty grid → { ok: false } (nothing was drawn)', async () => {
    const result = await instruct(createGrid(16), 'draw something', makeComplete('[]'))
    expect(result.ok).toBe(false)
  })

  it('empty grid → uses DRAW system prompt (no ASCII color key)', async () => {
    const completeMock = makeComplete('[{"x":0,"y":0,"color":"#ff004d"}]')
    await instruct(createGrid(16), 'draw a cat', completeMock)
    const [system] = completeMock.mock.calls[0]
    expect(system).toContain('pixel artist')
    expect(system).not.toContain('K=#000000')
  })

  it('non-empty grid → uses EDIT system prompt (includes ASCII color key)', async () => {
    const completeMock = makeComplete('[]')
    await instruct(nonEmptyGrid(), 'edit', completeMock)
    const [system] = completeMock.mock.calls[0]
    expect(system).toContain('K=#000000')
  })

  it('empty grid → uses larger generation token budget', async () => {
    const completeMock = makeComplete('[{"x":0,"y":0,"color":"#ff004d"}]')
    await instruct(createGrid(16), 'draw a cat', completeMock)
    const [, , maxTokens] = completeMock.mock.calls[0]
    expect(maxTokens).toBeGreaterThanOrEqual(512)
  })

  it('non-empty grid → token budget covers at least a full column of pixels', async () => {
    const completeMock = makeComplete('[]')
    await instruct(nonEmptyGrid(), 'draw vertical line', completeMock)
    const [, , maxTokens] = completeMock.mock.calls[0]
    expect(maxTokens).toBeGreaterThanOrEqual(16 * 12)
  })
})
