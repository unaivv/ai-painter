import { describe, it, expect } from 'vitest'
import { isInPalette } from './ColorPalette'
import { PICO8_PALETTE } from './pico8'

describe('PICO8_PALETTE', () => {
  it('has exactly 16 colors', () => {
    expect(PICO8_PALETTE.length).toBe(16)
  })

  it('contains valid hex color strings', () => {
    const hexPattern = /^#[0-9a-f]{6}$/
    expect(PICO8_PALETTE.every(c => hexPattern.test(c))).toBe(true)
  })
})

describe('isInPalette', () => {
  it('returns true for a color in the palette', () => {
    expect(isInPalette('#ff004d', PICO8_PALETTE)).toBe(true)
  })

  it('returns false for a color not in the palette', () => {
    expect(isInPalette('#ffffff', PICO8_PALETTE)).toBe(false)
  })

  it('is case-insensitive', () => {
    expect(isInPalette('#FF004D', PICO8_PALETTE)).toBe(true)
  })
})
