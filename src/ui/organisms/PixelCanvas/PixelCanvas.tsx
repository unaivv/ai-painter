import { useEffect, useRef } from 'react'

import { renderToCanvas } from '@/domain/canvas/DrawingEngine'
import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'

import { useCanvasPainter } from './useCanvasPainter'
import styles from './PixelCanvas.module.css'

const DEFAULT_CELL_SIZE = 12

type Props = {
  grid: CanvasGrid
  cellSize?: number
  loading?: boolean
  onCellClick?: (x: number, y: number) => void
}

export const PixelCanvas = ({ grid, cellSize = DEFAULT_CELL_SIZE, loading = false, onCellClick }: Props): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasPainter(onCellClick, cellSize, grid)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) renderToCanvas(grid, ctx, cellSize)
  }, [grid, cellSize])

  return (
    <div className={styles.wrapper}>
      <canvas
        ref={canvasRef}
        width={grid.width * cellSize}
        height={grid.height * cellSize}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        draggable={false}
      />
      {loading && (
        <div className={styles.loader}>
          <div className={styles.spinner} />
        </div>
      )}
    </div>
  )
}
