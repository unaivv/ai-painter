type Props = {
  palette: readonly string[]
  selected: string
  onSelect: (hex: string) => void
}

export const ColorPicker = ({ palette, selected, onSelect }: Props): JSX.Element => (
  <div>
    {palette.map(hex => (
      <button
        key={hex}
        style={{ background: hex }}
        aria-pressed={hex === selected ? 'true' : 'false'}
        onClick={() => onSelect(hex)}
      />
    ))}
  </div>
)
