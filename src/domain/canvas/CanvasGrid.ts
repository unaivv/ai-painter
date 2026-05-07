import type { GridSize, PixelInstruction } from './PixelInstruction'

export type CanvasGrid = {
  width: GridSize
  height: GridSize
  cells: string[][]
}

export const createGrid = (size: GridSize): CanvasGrid => ({
  width: size,
  height: size,
  cells: Array.from({ length: size }, () => Array(size).fill('')),
})

export const applyInstructions = (
  grid: CanvasGrid,
  instructions: PixelInstruction[],
): CanvasGrid => {
  const cells = grid.cells.map(row => [...row])
  for (const { x, y, color } of instructions) {
    if (y >= 0 && y < grid.height && x >= 0 && x < grid.width) {
      cells[y][x] = color
    }
  }
  return { ...grid, cells }
}
