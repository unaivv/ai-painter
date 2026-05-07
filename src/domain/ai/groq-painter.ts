import { PICO8_CODES } from '@/domain/palette/pico8'
import type { GridSize, PixelInstruction } from '@/domain/canvas/PixelInstruction'

import { parseAsciiGrid } from './parse-ascii-grid'
import type { Result } from './parse-instructions'

type CompleteFn = (system: string, user: string) => Promise<string>

const CODE_LEGEND = Object.entries(PICO8_CODES)
  .map(([code, hex]) => `${code}=${hex}`)
  .join(' ')

const buildSystemPrompt = (size: GridSize): string =>
  `You are a pixel artist. Draw on a ${size}×${size} grid using single-letter color codes.

COLOR CODES:
${CODE_LEGEND}
. = empty

OUTPUT: Exactly ${size} lines of exactly ${size} characters. Letters and dots only. No spaces, no numbers, no explanations.

RULES:
- Fill solid regions (not just outlines)
- Use at least 3 colors
- Center the subject on the grid
- Cover at least 40% of the canvas

EXAMPLE — a 6×6 red circle on white:
......
.WEEW.
WEEEEW
WEEEEW
.WEEW.
......`

export const paint = async (
  prompt: string,
  size: GridSize,
  complete: CompleteFn,
): Promise<Result<PixelInstruction[]>> => {
  try {
    const raw = await complete(buildSystemPrompt(size), prompt)
    return parseAsciiGrid(raw, PICO8_CODES)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { ok: false, error: `Groq request failed: ${message}` }
  }
}
