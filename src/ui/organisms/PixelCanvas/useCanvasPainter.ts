import { useRef } from 'react'

import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'

type MouseHandler = (e: React.MouseEvent<HTMLCanvasElement>) => void

type CanvasPainterHandlers = {
  handleMouseDown: MouseHandler
  handleMouseMove: MouseHandler
  handleMouseUp: () => void
}

const getCell = (e: React.MouseEvent<HTMLCanvasElement>, cellSize: number) => {
  const rect = e.currentTarget.getBoundingClientRect()
  return {
    col: Math.floor((e.clientX - rect.left) / cellSize),
    row: Math.floor((e.clientY - rect.top) / cellSize),
  }
}

const tryPaint = (
  e: React.MouseEvent<HTMLCanvasElement>,
  onCellClick: ((x: number, y: number) => void) | undefined,
  cellSize: number,
  grid: CanvasGrid,
): void => {
  if (!onCellClick) return
  const { col, row } = getCell(e, cellSize)
  if (col < 0 || col >= grid.width || row < 0 || row >= grid.height) return
  onCellClick(col, row)
}

export const useCanvasPainter = (
  onCellClick: ((x: number, y: number) => void) | undefined,
  cellSize: number,
  grid: CanvasGrid,
): CanvasPainterHandlers => {
  const isDrawingRef = useRef(false)

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    e.preventDefault()
    isDrawingRef.current = true
    tryPaint(e, onCellClick, cellSize, grid)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (isDrawingRef.current) tryPaint(e, onCellClick, cellSize, grid)
  }

  const handleMouseUp = (): void => { isDrawingRef.current = false }

  return { handleMouseDown, handleMouseMove, handleMouseUp }
}
