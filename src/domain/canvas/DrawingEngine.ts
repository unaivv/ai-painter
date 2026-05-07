import type { CanvasGrid } from './CanvasGrid'

export const renderToCanvas = (
  grid: CanvasGrid,
  ctx: CanvasRenderingContext2D,
  cellSize: number,
): void => {
  ctx.clearRect(0, 0, grid.width * cellSize, grid.height * cellSize)

  for (let row = 0; row < grid.height; row++) {
    for (let col = 0; col < grid.width; col++) {
      const color = grid.cells[row][col]
      if (color) {
        ctx.fillStyle = color
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
      }
    }
  }

  ctx.strokeStyle = '#e5e5e5'
  ctx.lineWidth = 0.5
  for (let i = 0; i <= grid.width; i++) {
    ctx.beginPath()
    ctx.moveTo(i * cellSize, 0)
    ctx.lineTo(i * cellSize, grid.height * cellSize)
    ctx.stroke()
  }
  for (let i = 0; i <= grid.height; i++) {
    ctx.beginPath()
    ctx.moveTo(0, i * cellSize)
    ctx.lineTo(grid.width * cellSize, i * cellSize)
    ctx.stroke()
  }
}
