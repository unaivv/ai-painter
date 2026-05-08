import { describe, it, expect } from 'vitest'
import { serializeGrid } from './serialize-grid'
import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'
import { PICO8_CODES } from '@/domain/palette/pico8'

const makeGrid = (cells: string[][]): CanvasGrid => ({
  width: cells[0].length as CanvasGrid['width'],
  height: cells.length as CanvasGrid['height'],
  cells,
})

describe('serializeGrid', () => {
  it('empty grid — every char is dot', () => {
    const grid = makeGrid([
      ['', ''],
      ['', ''],
    ])
    const result = serializeGrid(grid, PICO8_CODES)
    expect(result).toBe('..\n..')
  })

  it('2×1 grid: cell (0,0) has color hex → letter; cell (1,0) empty → dot', () => {
    const grid = makeGrid([['#000000', '']])
    const result = serializeGrid(grid, PICO8_CODES)
    expect(result).toBe('K.')
  })

  it('unknown hex → dot', () => {
    const grid = makeGrid([['#badbad', '']])
    const result = serializeGrid(grid, PICO8_CODES)
    expect(result).toBe('..')
  })

  it('2×2 grid → rows joined by newline, no trailing newline', () => {
    const grid = makeGrid([
      ['#000000', '#1d2b53'],
      ['', '#ff004d'],
    ])
    const result = serializeGrid(grid, PICO8_CODES)
    expect(result).toBe('KN\n.E')
    expect(result.endsWith('\n')).toBe(false)
  })
})
