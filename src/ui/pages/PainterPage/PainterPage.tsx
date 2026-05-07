import { useState } from 'react'

import { usePainter } from '@/hooks/use-painter'
import { PixelCanvas } from '@/ui/organisms/PixelCanvas/PixelCanvas'
import { ChatPanel } from '@/ui/organisms/ChatPanel/ChatPanel'
import { GridSizeSelector } from '@/ui/molecules/GridSizeSelector/GridSizeSelector'
import { ColorPicker } from '@/ui/molecules/ColorPicker/ColorPicker'
import { PICO8_PALETTE } from '@/domain/palette/pico8'
import type { GridSize } from '@/domain/canvas/PixelInstruction'

export const PainterPage = (): JSX.Element => {
  const [size, setSize] = useState<GridSize>(16)
  const {
    grid,
    loading,
    error,
    paintPrompt,
    reset,
    selectedColor,
    setSelectedColor,
    paintCell,
  } = usePainter(size)

  const handleSizeChange = (newSize: GridSize): void => {
    setSize(newSize)
    reset(newSize)
  }

  return (
    <div>
      <header>
        <h1>AI Painter</h1>
        <GridSizeSelector value={size} onChange={handleSizeChange} />
      </header>
      <main>
        <ColorPicker
          palette={PICO8_PALETTE}
          selected={selectedColor}
          onSelect={setSelectedColor}
        />
        <PixelCanvas grid={grid} onCellClick={paintCell} />
        <ChatPanel onSubmit={paintPrompt} loading={loading} error={error} />
      </main>
    </div>
  )
}
