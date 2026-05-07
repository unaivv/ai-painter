import { useState, useCallback } from 'react'

import { createGrid, applyInstructions } from '@/domain/canvas/CanvasGrid'
import { paint } from '@/domain/ai/groq-painter'
import { instruct } from '@/domain/ai/instruct-painter'
import { complete } from '@/infrastructure/groq/groq-client'
import { PICO8_PALETTE } from '@/domain/palette/pico8'
import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'
import type { GridSize } from '@/domain/canvas/PixelInstruction'

type PainterState = {
  grid: CanvasGrid
  loading: boolean
  error: string | null
  selectedColor: string
}

type PainterActions = {
  paintPrompt: (prompt: string) => Promise<void>
  reset: (size: GridSize) => void
  paintCell: (x: number, y: number) => void
  setSelectedColor: (hex: string) => void
}

const isGridEmpty = (grid: CanvasGrid): boolean =>
  grid.cells.every(row => row.every(cell => !cell))

export const usePainter = (initialSize: GridSize = 16): PainterState & PainterActions => {
  const [grid, setGrid] = useState<CanvasGrid>(() => createGrid(initialSize))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>(PICO8_PALETTE[0])

  const paintCell = useCallback(
    (x: number, y: number): void => {
      setGrid(prev => applyInstructions(prev, [{ x, y, color: selectedColor }]))
    },
    [selectedColor],
  )

  const paintPrompt = useCallback(
    async (prompt: string) => {
      setLoading(true)
      setError(null)
      try {
        if (isGridEmpty(grid)) {
          const result = await paint(prompt, grid.width, complete)
          if (result.ok) {
            setGrid(prev => applyInstructions(createGrid(prev.width), result.value))
          } else {
            setError(result.error)
          }
        } else {
          const result = await instruct(grid, prompt, complete)
          if (result.ok) {
            setGrid(prev => applyInstructions(prev, result.value))
          } else {
            setError(result.error)
          }
        }
      } finally {
        setLoading(false)
      }
    },
    [grid],
  )

  const reset = useCallback((size: GridSize) => {
    setGrid(createGrid(size))
    setError(null)
  }, [])

  return { grid, loading, error, selectedColor, setSelectedColor, paintPrompt, reset, paintCell }
}
