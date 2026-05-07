import { useState } from 'react'

import { usePainter } from '@/hooks/use-painter'
import { PixelCanvas } from '@/ui/organisms/PixelCanvas/PixelCanvas'
import { ChatPanel } from '@/ui/organisms/ChatPanel/ChatPanel'
import { GridSizeSelector } from '@/ui/molecules/GridSizeSelector/GridSizeSelector'
import { CanvasToolbar } from '@/ui/molecules/CanvasToolbar/CanvasToolbar'
import { PICO8_PALETTE } from '@/domain/palette/pico8'
import type { GridSize } from '@/domain/canvas/PixelInstruction'

import styles from './PainterPage.module.css'

const DEFAULT_GRID_SIZE: GridSize = 16

export const PainterPage = (): JSX.Element => {
  const [size, setSize] = useState<GridSize>(DEFAULT_GRID_SIZE)
  const { grid, loading, error, paintPrompt, reset, selectedColor, setSelectedColor, paintCell } =
    usePainter(size)

  const handleSizeChange = (newSize: GridSize): void => {
    setSize(newSize)
    reset(newSize)
  }

  const isEmpty = grid.cells.every(row => row.every(cell => !cell))

  return (
    <div>
      <header className={styles.header}>
        <h1>AI Painter</h1>
        <GridSizeSelector value={size} onChange={handleSizeChange} />
      </header>
      <main className={styles.main}>
        <div className={styles.canvasPanel}>
          <CanvasToolbar
            palette={PICO8_PALETTE}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            onClear={() => reset(size)}
          />
          <PixelCanvas grid={grid} onCellClick={paintCell} />
          <p className={styles.modeHint}>
            {isEmpty ? 'Empty canvas — AI will generate from scratch' : 'Canvas has content — AI will edit existing pixels'}
          </p>
        </div>
        <ChatPanel onSubmit={paintPrompt} loading={loading} error={error} />
      </main>
    </div>
  )
}
