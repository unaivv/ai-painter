import { useState, useCallback } from 'react'

import { createGrid, applyInstructions } from '@/domain/canvas/CanvasGrid'
import { paint } from '@/domain/ai/groq-painter'
import { complete } from '@/infrastructure/groq/groq-client'
import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'
import type { GridSize } from '@/domain/canvas/PixelInstruction'

type PainterState = {
  grid: CanvasGrid
  loading: boolean
  error: string | null
}

type PainterActions = {
  paintPrompt: (prompt: string) => Promise<void>
  reset: (size: GridSize) => void
}

export const usePainter = (initialSize: GridSize = 16): PainterState & PainterActions => {
  const [grid, setGrid] = useState<CanvasGrid>(() => createGrid(initialSize))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const paintPrompt = useCallback(async (prompt: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await paint(prompt, grid.width, complete)
      if (result.ok) {
        setGrid(prev => applyInstructions(createGrid(prev.width), result.value))
      } else {
        setError(result.error)
      }
    } finally {
      setLoading(false)
    }
  }, [grid.width])

  const reset = useCallback((size: GridSize) => {
    setGrid(createGrid(size))
    setError(null)
  }, [])

  return { grid, loading, error, paintPrompt, reset }
}
