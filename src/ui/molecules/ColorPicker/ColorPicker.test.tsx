import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ColorPicker } from './ColorPicker'
import { PICO8_PALETTE } from '@/domain/palette/pico8'

describe('ColorPicker', () => {
  it('renders exactly 16 swatches (one per palette color)', () => {
    render(
      <ColorPicker
        palette={PICO8_PALETTE}
        selected={PICO8_PALETTE[0]}
        onSelect={vi.fn()}
      />,
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(16)
  })

  it('click swatch → onSelect called with correct hex', () => {
    const onSelect = vi.fn()
    render(
      <ColorPicker
        palette={PICO8_PALETTE}
        selected={PICO8_PALETTE[0]}
        onSelect={onSelect}
      />,
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[3])
    expect(onSelect).toHaveBeenCalledWith(PICO8_PALETTE[3])
  })

  it('selected swatch has aria-pressed="true"; others "false"', () => {
    render(
      <ColorPicker
        palette={PICO8_PALETTE}
        selected={PICO8_PALETTE[2]}
        onSelect={vi.fn()}
      />,
    )
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn, i) => {
      if (i === 2) {
        expect(btn).toHaveAttribute('aria-pressed', 'true')
      } else {
        expect(btn).toHaveAttribute('aria-pressed', 'false')
      }
    })
  })
})
