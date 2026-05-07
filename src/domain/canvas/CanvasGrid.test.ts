import { describe, it, expect } from 'vitest'
import { createGrid, applyInstructions } from './CanvasGrid'

describe('createGrid', () => {
  it('creates a grid with correct dimensions', () => {
    const grid = createGrid(32)
    expect(grid.width).toBe(32)
    expect(grid.height).toBe(32)
  })

  it('initializes all cells as empty strings', () => {
    const grid = createGrid(16)
    expect(grid.cells.length).toBe(16)
    expect(grid.cells[0].length).toBe(16)
    expect(grid.cells[0][0]).toBe('')
  })
})

describe('applyInstructions', () => {
  it('paints valid cells with the given color', () => {
    const grid = createGrid(32)
    const result = applyInstructions(grid, [
      { x: 0, y: 0, color: '#000000' },
      { x: 1, y: 0, color: '#ff004d' },
    ])
    expect(result.cells[0][0]).toBe('#000000')
    expect(result.cells[0][1]).toBe('#ff004d')
  })

  it('does not mutate the original grid', () => {
    const grid = createGrid(16)
    applyInstructions(grid, [{ x: 0, y: 0, color: '#ff004d' }])
    expect(grid.cells[0][0]).toBe('')
  })

  it('silently ignores out-of-bounds coordinates', () => {
    const grid = createGrid(16)
    expect(() =>
      applyInstructions(grid, [{ x: 20, y: 20, color: '#ff004d' }])
    ).not.toThrow()
    const result = applyInstructions(grid, [{ x: 20, y: 20, color: '#ff004d' }])
    expect(result.cells.every(row => row.every(cell => cell === ''))).toBe(true)
  })

  it('applies multiple instructions in order', () => {
    const grid = createGrid(16)
    const result = applyInstructions(grid, [
      { x: 0, y: 0, color: '#000000' },
      { x: 0, y: 0, color: '#ff004d' },
    ])
    expect(result.cells[0][0]).toBe('#ff004d')
  })
})
