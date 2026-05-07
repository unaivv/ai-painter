import { useEffect, useRef } from 'react'
import { renderToCanvas } from '@/domain/canvas/DrawingEngine'
import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'

interface Props {
  grid: CanvasGrid
  cellSize?: number
}

export const PixelCanvas = ({ grid, cellSize = 12 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) renderToCanvas(grid, ctx, cellSize)
  }, [grid, cellSize])

  return (
    <canvas
      ref={canvasRef}
      width={grid.width * cellSize}
      height={grid.height * cellSize}
    />
  )
}
