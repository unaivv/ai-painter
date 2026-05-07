import { useState } from 'react'
import { usePainter } from '@/hooks/usePainter'
import { PixelCanvas } from '@/ui/organisms/PixelCanvas/PixelCanvas'
import { ChatPanel } from '@/ui/organisms/ChatPanel/ChatPanel'
import { GridSizeSelector } from '@/ui/molecules/GridSizeSelector/GridSizeSelector'
import type { GridSize } from '@/domain/canvas/PixelInstruction'

export const PainterPage = () => {
  const [size, setSize] = useState<GridSize>(16)
  const { grid, loading, error, paintPrompt, reset } = usePainter(size)

  const handleSizeChange = (newSize: GridSize) => {
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
        <PixelCanvas grid={grid} />
        <ChatPanel onSubmit={paintPrompt} loading={loading} error={error} />
      </main>
    </div>
  )
}
