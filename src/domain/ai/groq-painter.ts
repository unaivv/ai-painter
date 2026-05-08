import { PICO8_CODES } from '@/domain/palette/pico8'
import type { GridSize, PixelInstruction } from '@/domain/canvas/PixelInstruction'

import { parseAsciiGrid } from './parse-ascii-grid'
import type { Result } from './parse-instructions'

type CompleteFn = (system: string, user: string, maxTokens: number) => Promise<string>

const CODE_LEGEND = Object.entries(PICO8_CODES)
  .map(([code, hex]) => `${code}=${hex}`)
  .join(' ')

const buildSystemPrompt = (size: GridSize): string =>
  `You are a pixel artist. Draw on a ${size}×${size} grid using single-letter color codes.

COLOR CODES:
${CODE_LEGEND}
. = empty (transparent, shows white)

OUTPUT RULES (non-negotiable):
- Exactly ${size} lines, exactly ${size} characters per line
- Only color code letters and dots — no spaces, no numbers, no text before or after
- Do NOT wrap in markdown, do NOT explain

DRAWING RULES:
- Fill solid color regions, not just outlines
- Think about the subject's silhouette: head, body, limbs — assign each a grid region
- Use at least 3 colors
- Center the subject, cover at least 40% of cells

EXAMPLE — a dog on a 16×16 grid (T=tan fur, K=black, D=dark gray, W=white):
................
................
....KKKK........
...KTTTTK.......
...KT..TK.......
....KTTTKK......
....KTTTTTK.....
...KTTTTTTK.....
..KTTTTTTTTK....
..KTTTTTTTTK....
..KTTTTTTTK.....
...KTTTTTTK.....
....KTK.KTK.....
....KTK.KTK.....
....KKK.KKK.....
................`

const gridOutputTokens = (size: GridSize): number =>
  Math.ceil((size * (size + 1)) / 3)

export const paint = async (
  prompt: string,
  size: GridSize,
  complete: CompleteFn,
): Promise<Result<PixelInstruction[]>> => {
  try {
    const userMessage = `Draw: ${prompt}\n\nOutput the ${size}×${size} grid now. Nothing else.`
    const raw = await complete(buildSystemPrompt(size), userMessage, gridOutputTokens(size))
    return parseAsciiGrid(raw, PICO8_CODES)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { ok: false, error: `Groq request failed: ${message}` }
  }
}
