import { useState, useCallback } from 'react'

import { createGrid, applyInstructions } from '@/domain/canvas/CanvasGrid'
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
  clearError: () => void
}

type SetGrid = React.Dispatch<React.SetStateAction<CanvasGrid>>
type SetStr = React.Dispatch<React.SetStateAction<string | null>>
type SetBool = React.Dispatch<React.SetStateAction<boolean>>

const usePaintCell = (setGrid: SetGrid, selectedColor: string) =>
  useCallback((x: number, y: number): void => {
    setGrid(prev => applyInstructions(prev, [{ x, y, color: selectedColor }]))
  }, [setGrid, selectedColor])

const usePaintPrompt = (grid: CanvasGrid, setGrid: SetGrid, setLoading: SetBool, setError: SetStr) =>
  useCallback(async (prompt: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const result = await instruct(grid, prompt, complete)
      if (result.ok) setGrid(prev => applyInstructions(prev, result.value))
      else setError(result.error)
    } finally { setLoading(false) }
  }, [grid, setGrid, setLoading, setError])

const DEFAULT_GRID_SIZE: GridSize = 16

export const usePainter = (initialSize: GridSize = DEFAULT_GRID_SIZE): PainterState & PainterActions => {
  const [grid, setGrid] = useState<CanvasGrid>(() => createGrid(initialSize))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>(PICO8_PALETTE[0])

  const paintCell = usePaintCell(setGrid, selectedColor)
  const paintPrompt = usePaintPrompt(grid, setGrid, setLoading, setError)
  const reset = useCallback((size: GridSize): void => { setGrid(createGrid(size)); setError(null) }, [])
  const clearError = useCallback((): void => setError(null), [])

  return { grid, loading, error, selectedColor, setSelectedColor, paintPrompt, reset, paintCell, clearError }
}
