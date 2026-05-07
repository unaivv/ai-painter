import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePainter } from './use-painter'
import { PICO8_PALETTE } from '@/domain/palette/pico8'
import { applyInstructions } from '@/domain/canvas/CanvasGrid'

vi.mock('@/domain/ai/instruct-painter', () => ({
  instruct: vi.fn().mockResolvedValue({ ok: true, value: [] }),
}))

vi.mock('@/infrastructure/groq/groq-client', () => ({
  complete: vi.fn(),
}))

import { instruct } from '@/domain/ai/instruct-painter'

const instructMock = vi.mocked(instruct)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('usePainter — paintCell', () => {
  it('applies instruction with selectedColor; instruct NOT called', () => {
    const { result } = renderHook(() => usePainter(16))

    const initialGrid = result.current.grid
    act(() => { result.current.paintCell(3, 5) })

    const expected = applyInstructions(initialGrid, [{ x: 3, y: 5, color: PICO8_PALETTE[0] }])
    expect(result.current.grid.cells[5][3]).toBe(expected.cells[5][3])
    expect(instructMock).not.toHaveBeenCalled()
  })

  it('selectedColor defaults to first palette color', () => {
    const { result } = renderHook(() => usePainter(16))
    expect(result.current.selectedColor).toBe(PICO8_PALETTE[0])
  })

  it('setSelectedColor updates state', () => {
    const { result } = renderHook(() => usePainter(16))
    act(() => { result.current.setSelectedColor('#ff004d') })
    expect(result.current.selectedColor).toBe('#ff004d')
  })
})

describe('usePainter — paintPrompt', () => {
  it('always calls instruct() regardless of canvas state', async () => {
    const { result } = renderHook(() => usePainter(16))

    await act(async () => { await result.current.paintPrompt('a cat') })

    expect(instructMock).toHaveBeenCalledOnce()
  })

  it('instruct() success → grid updated with delta', async () => {
    instructMock.mockResolvedValueOnce({ ok: true, value: [{ x: 0, y: 0, color: '#ff004d' }] })

    const { result } = renderHook(() => usePainter(16))

    await act(async () => { await result.current.paintPrompt('add red pixel') })

    expect(result.current.grid.cells[0][0]).toBe('#ff004d')
  })

  it('instruct() failure → grid unchanged, error set', async () => {
    instructMock.mockResolvedValueOnce({ ok: false, error: 'bad delta' })

    const { result } = renderHook(() => usePainter(16))
    act(() => { result.current.paintCell(0, 0) })
    const gridBefore = result.current.grid

    await act(async () => { await result.current.paintPrompt('do something') })

    expect(result.current.grid).toBe(gridBefore)
    expect(result.current.error).toBe('bad delta')
  })
})
