import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'

export const serializeGrid = (
  grid: CanvasGrid,
  codeMap: Record<string, string>,
): string => {
  const inverse = Object.fromEntries(
    Object.entries(codeMap).map(([letter, hex]) => [hex, letter]),
  )

  return grid.cells
    .map(row =>
      row.map(hex => inverse[hex] ?? '.').join(''),
    )
    .join('\n')
}
