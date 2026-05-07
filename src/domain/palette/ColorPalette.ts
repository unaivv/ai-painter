export type ColorPalette = readonly string[]

export const isInPalette = (hex: string, palette: ColorPalette): boolean =>
  palette.includes(hex.toLowerCase())
