import { ColorPicker } from '@/ui/molecules/ColorPicker/ColorPicker'

import styles from './CanvasToolbar.module.css'

type Props = {
  palette: readonly string[]
  selectedColor: string
  onSelectColor: (hex: string) => void
  onClear: () => void
}

const ERASE_COLOR = ''

export const CanvasToolbar = ({ palette, selectedColor, onSelectColor, onClear }: Props): JSX.Element => {
  const erasing = selectedColor === ERASE_COLOR

  const toggleErase = (): void => {
    onSelectColor(erasing ? palette[0] : ERASE_COLOR)
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.colorPickerSlot}>
        <ColorPicker palette={palette} selected={selectedColor} onSelect={onSelectColor} />
      </div>
      <button
        className={`${styles.btn}${erasing ? ` ${styles.btnActive}` : ''}`}
        onClick={toggleErase}
      >
        {erasing ? 'Erasing' : 'Erase'}
      </button>
      <button className={`${styles.btn} ${styles.btnDanger}`} onClick={onClear}>
        Clear
      </button>
    </div>
  )
}
