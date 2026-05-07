import type { PixelInstruction } from '@/domain/canvas/PixelInstruction'

import type { Result } from './parse-instructions'

const GRID_LINE = /^[A-Z.]+$/i
const MIN_GRID_LINE_LENGTH = 2

const extractGridLines = (raw: string): string[] =>
  raw
    .replace(/<think>[\s\S]*?<\/think>/i, '')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length >= MIN_GRID_LINE_LENGTH && GRID_LINE.test(l))

export const parseAsciiGrid = (
  raw: string,
  codeMap: Record<string, string>,
): Result<PixelInstruction[]> => {
  const lines = extractGridLines(raw)

  if (lines.length === 0) return { ok: false, error: 'Failed to parse: no grid rows found' }

  const instructions: PixelInstruction[] = []
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      const color = codeMap[lines[y][x].toUpperCase()]
      if (color) instructions.push({ x, y, color })
    }
  }

  if (instructions.length === 0) {
    return { ok: false, error: 'Failed to parse: no colored pixels found' }
  }
  return { ok: true, value: instructions }
}
