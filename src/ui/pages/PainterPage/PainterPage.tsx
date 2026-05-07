import { useState } from 'react'

import { usePainter } from '@/hooks/use-painter'
import { PixelCanvas } from '@/ui/organisms/PixelCanvas/PixelCanvas'
import { ChatPanel } from '@/ui/organisms/ChatPanel/ChatPanel'
import { GridSizeSelector } from '@/ui/molecules/GridSizeSelector/GridSizeSelector'
import { ColorPicker } from '@/ui/molecules/ColorPicker/ColorPicker'
import { PICO8_PALETTE } from '@/domain/palette/pico8'
import type { GridSize } from '@/domain/canvas/PixelInstruction'

import './PainterPage.css'

export const PainterPage = (): JSX.Element => {
  const [size, setSize] = useState<GridSize>(16)
  const { grid, loading, error, paintPrompt, reset, selectedColor, setSelectedColor, paintCell } =
    usePainter(size)

  const handleSizeChange = (newSize: GridSize): void => {
    setSize(newSize)
    reset(newSize)
  }

  const isEmpty = grid.cells.every(row => row.every(cell => !cell))

  return (
    <div>
      <header className="painter-header">
        <h1>AI Painter</h1>
        <GridSizeSelector value={size} onChange={handleSizeChange} />
      </header>
      <main className="painter-main">
        <div className="canvas-panel">
          <ColorPicker palette={PICO8_PALETTE} selected={selectedColor} onSelect={setSelectedColor} />
          <PixelCanvas grid={grid} onCellClick={paintCell} />
          <p className="painter-mode-hint">
            {isEmpty ? 'Empty canvas — AI will generate from scratch' : 'Canvas has content — AI will edit existing pixels'}
          </p>
        </div>
        <ChatPanel onSubmit={paintPrompt} loading={loading} error={error} />
      </main>
    </div>
  )
}
