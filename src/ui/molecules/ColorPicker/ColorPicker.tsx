import './ColorPicker.css'

type Props = {
  palette: readonly string[]
  selected: string
  onSelect: (hex: string) => void
}

export const ColorPicker = ({ palette, selected, onSelect }: Props): JSX.Element => (
  <div className="color-picker">
    {palette.map(hex => (
      <button
        key={hex}
        className="color-picker__swatch"
        style={{ background: hex }}
        aria-pressed={hex === selected ? 'true' : 'false'}
        aria-label={hex}
        onClick={() => onSelect(hex)}
      />
    ))}
  </div>
)
