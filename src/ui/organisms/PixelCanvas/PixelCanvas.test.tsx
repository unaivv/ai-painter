import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { PixelCanvas } from './PixelCanvas'
import { createGrid } from '@/domain/canvas/CanvasGrid'

const CELL_SIZE = 12

const renderWithRect = (onCellClick?: (x: number, y: number) => void, loading = false) => {
  const grid = createGrid(16)
  const { container } = render(
    <PixelCanvas grid={grid} cellSize={CELL_SIZE} onCellClick={onCellClick} loading={loading} />,
  )
  const canvas = container.querySelector('canvas')!

  canvas.getBoundingClientRect = vi.fn().mockReturnValue({
    left: 0, top: 0,
    right: 16 * CELL_SIZE, bottom: 16 * CELL_SIZE,
    width: 16 * CELL_SIZE, height: 16 * CELL_SIZE,
    x: 0, y: 0,
    toJSON: () => {},
  })

  return { canvas, container }
}

describe('PixelCanvas — painting', () => {
  it('mouseDown at known clientX/clientY → onCellClick(col, row) called', () => {
    const onCellClick = vi.fn()
    const { canvas } = renderWithRect(onCellClick)

    fireEvent.mouseDown(canvas, { clientX: 30, clientY: 42 })

    expect(onCellClick).toHaveBeenCalledWith(2, 3)
  })

  it('mouseDown at (0,0) cell → onCellClick(0, 0) called', () => {
    const onCellClick = vi.fn()
    const { canvas } = renderWithRect(onCellClick)

    fireEvent.mouseDown(canvas, { clientX: 6, clientY: 6 })

    expect(onCellClick).toHaveBeenCalledWith(0, 0)
  })

  it('mouseDown outside grid bounds → onCellClick NOT called', () => {
    const onCellClick = vi.fn()
    const { canvas } = renderWithRect(onCellClick)

    fireEvent.mouseDown(canvas, { clientX: 16 * CELL_SIZE + 5, clientY: 6 })

    expect(onCellClick).not.toHaveBeenCalled()
  })

  it('onCellClick is optional — no crash on mouseDown', () => {
    const { canvas } = renderWithRect()
    expect(() => fireEvent.mouseDown(canvas, { clientX: 6, clientY: 6 })).not.toThrow()
  })

  it('mouseMove while drawing → onCellClick called for each cell', () => {
    const onCellClick = vi.fn()
    const { canvas } = renderWithRect(onCellClick)

    fireEvent.mouseDown(canvas, { clientX: 6, clientY: 6 })
    fireEvent.mouseMove(canvas, { clientX: 18, clientY: 6 })
    fireEvent.mouseMove(canvas, { clientX: 30, clientY: 6 })

    expect(onCellClick).toHaveBeenCalledTimes(3)
    expect(onCellClick).toHaveBeenNthCalledWith(1, 0, 0)
    expect(onCellClick).toHaveBeenNthCalledWith(2, 1, 0)
    expect(onCellClick).toHaveBeenNthCalledWith(3, 2, 0)
  })

  it('mouseMove without mouseDown → onCellClick NOT called', () => {
    const onCellClick = vi.fn()
    const { canvas } = renderWithRect(onCellClick)

    fireEvent.mouseMove(canvas, { clientX: 6, clientY: 6 })

    expect(onCellClick).not.toHaveBeenCalled()
  })

  it('mouseUp stops drag — subsequent mouseMove does not paint', () => {
    const onCellClick = vi.fn()
    const { canvas } = renderWithRect(onCellClick)

    fireEvent.mouseDown(canvas, { clientX: 6, clientY: 6 })
    fireEvent.mouseUp(canvas)
    fireEvent.mouseMove(canvas, { clientX: 18, clientY: 6 })

    expect(onCellClick).toHaveBeenCalledTimes(1)
  })
})

describe('PixelCanvas — loader', () => {
  it('loading=true renders spinner overlay', () => {
    const { container } = renderWithRect(undefined, true)
    expect(container.querySelector('[class*="loader"]')).toBeTruthy()
    expect(container.querySelector('[class*="spinner"]')).toBeTruthy()
  })

  it('loading=false does not render spinner', () => {
    const { container } = renderWithRect(undefined, false)
    expect(container.querySelector('[class*="loader"]')).toBeNull()
  })
})
