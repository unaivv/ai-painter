import { useEffect, useRef } from 'react'

import { renderToCanvas } from '@/domain/canvas/DrawingEngine'
import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'

type Props = {
  grid: CanvasGrid
  cellSize?: number
  onCellClick?: (x: number, y: number) => void
}

export const PixelCanvas = ({ grid, cellSize = 12, onCellClick }: Props): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) renderToCanvas(grid, ctx, cellSize)
  }, [grid, cellSize])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!onCellClick) return
    const rect = e.currentTarget.getBoundingClientRect()
    const col = Math.floor((e.clientX - rect.left) / cellSize)
    const row = Math.floor((e.clientY - rect.top) / cellSize)
    if (col < 0 || col >= grid.width || row < 0 || row >= grid.height) return
    onCellClick(col, row)
  }

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        width={grid.width * cellSize}
        height={grid.height * cellSize}
        onClick={handleClick}
      />
    </div>
  )
}
