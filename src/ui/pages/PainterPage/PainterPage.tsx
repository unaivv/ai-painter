import { useState } from 'react'

import { usePainter } from '@/hooks/use-painter'
import { PixelCanvas } from '@/ui/organisms/PixelCanvas/PixelCanvas'
import { ChatPanel } from '@/ui/organisms/ChatPanel/ChatPanel'
import { GridSizeSelector } from '@/ui/molecules/GridSizeSelector/GridSizeSelector'
import { CanvasToolbar } from '@/ui/molecules/CanvasToolbar/CanvasToolbar'
import { PICO8_PALETTE } from '@/domain/palette/pico8'
import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'
import type { GridSize } from '@/domain/canvas/PixelInstruction'

import styles from './PainterPage.module.css'

const DEFAULT_GRID_SIZE: GridSize = 16

type CanvasSectionProps = {
  grid: CanvasGrid
  loading: boolean
  selectedColor: string
  onSelectColor: (hex: string) => void
  onCellClick: (x: number, y: number) => void
  onClear: () => void
}

const CanvasSection = ({ grid, loading, selectedColor, onSelectColor, onCellClick, onClear }: CanvasSectionProps): JSX.Element => {
  const isEmpty = grid.cells.every(row => row.every(cell => !cell))
  return (
    <div className={styles.canvasPanel}>
      <CanvasToolbar palette={PICO8_PALETTE} selectedColor={selectedColor} onSelectColor={onSelectColor} onClear={onClear} />
      <PixelCanvas grid={grid} onCellClick={onCellClick} loading={loading} />
      <p className={styles.modeHint}>
        {isEmpty ? 'Empty canvas — AI will generate from scratch' : 'Canvas has content — AI will edit existing pixels'}
      </p>
    </div>
  )
}

export const PainterPage = (): JSX.Element => {
  const [size, setSize] = useState<GridSize>(DEFAULT_GRID_SIZE)
  const { grid, loading, error, paintPrompt, reset, selectedColor, setSelectedColor, paintCell, clearError } = usePainter(size)

  const handleSizeChange = (newSize: GridSize): void => { setSize(newSize); reset(newSize) }

  return (
    <div>
      <header className={styles.header}>
        <h1>AI Painter</h1>
        <GridSizeSelector value={size} onChange={handleSizeChange} />
      </header>
      <main className={styles.main}>
        <CanvasSection grid={grid} loading={loading} selectedColor={selectedColor} onSelectColor={setSelectedColor} onCellClick={paintCell} onClear={() => reset(size)} />
        <ChatPanel onSubmit={paintPrompt} loading={loading} error={error} onDismissError={clearError} />
      </main>
    </div>
  )
}
