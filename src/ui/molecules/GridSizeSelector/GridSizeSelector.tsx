import type { GridSize } from '@/domain/canvas/PixelInstruction'

interface Props {
  value: GridSize
  onChange: (size: GridSize) => void
}

const SIZES: GridSize[] = [16, 32, 64, 100]

export const GridSizeSelector = ({ value, onChange }: Props) => (
  <select value={value} onChange={e => onChange(Number(e.target.value) as GridSize)}>
    {SIZES.map(s => (
      <option key={s} value={s}>
        {s}×{s}
      </option>
    ))}
  </select>
)
