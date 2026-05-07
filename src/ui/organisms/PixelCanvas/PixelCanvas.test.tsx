import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { PixelCanvas } from './PixelCanvas'
import { createGrid } from '@/domain/canvas/CanvasGrid'

const CELL_SIZE = 12

const renderWithRect = (onCellClick?: (x: number, y: number) => void) => {
  const grid = createGrid(16)
  const { container } = render(
    <PixelCanvas grid={grid} cellSize={CELL_SIZE} onCellClick={onCellClick} />,
  )
  const canvas = container.querySelector('canvas')!

  canvas.getBoundingClientRect = vi.fn().mockReturnValue({
    left: 0,
    top: 0,
    right: 16 * CELL_SIZE,
    bottom: 16 * CELL_SIZE,
    width: 16 * CELL_SIZE,
    height: 16 * CELL_SIZE,
    x: 0,
    y: 0,
    toJSON: () => {},
  })

  return { canvas }
}

describe('PixelCanvas — onCellClick', () => {
  it('click at known clientX/clientY → onCellClick(col, row) called', () => {
    const onCellClick = vi.fn()
    const { canvas } = renderWithRect(onCellClick)

    // Click at cell (2, 3): clientX = 2*12 + 6 = 30, clientY = 3*12 + 6 = 42
    fireEvent.click(canvas, { clientX: 30, clientY: 42 })

    expect(onCellClick).toHaveBeenCalledWith(2, 3)
  })

  it('click at (0, 0) cell → onCellClick(0, 0) called', () => {
    const onCellClick = vi.fn()
    const { canvas } = renderWithRect(onCellClick)

    fireEvent.click(canvas, { clientX: 6, clientY: 6 })

    expect(onCellClick).toHaveBeenCalledWith(0, 0)
  })

  it('click outside grid bounds → onCellClick NOT called', () => {
    const onCellClick = vi.fn()
    const { canvas } = renderWithRect(onCellClick)

    // Outside: col 16 would be out of 16-wide grid (cols 0..15)
    fireEvent.click(canvas, { clientX: 16 * CELL_SIZE + 5, clientY: 6 })

    expect(onCellClick).not.toHaveBeenCalled()
  })

  it('onCellClick is optional — no crash when not provided', () => {
    const { canvas } = renderWithRect()
    expect(() => fireEvent.click(canvas, { clientX: 6, clientY: 6 })).not.toThrow()
  })
})
