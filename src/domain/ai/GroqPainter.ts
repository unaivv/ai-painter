import { complete } from '@/infrastructure/groq/GroqClient'
import { parseInstructions } from './parseInstructions'
import type { Result } from './parseInstructions'
import type { GridSize, PixelInstruction } from '@/domain/canvas/PixelInstruction'

const buildSystemPrompt = (width: GridSize, height: GridSize, palette: readonly string[]): string => {
  const cx = Math.floor(width / 2)
  const cy = Math.floor(height / 2)
  const minPixels = Math.floor(width * height * 0.45)
  const headMaxY = Math.floor(height * 0.25) - 1
  const bodyMaxY = Math.floor(height * 0.75) - 1
  const bodyMinY = headMaxY + 1
  const legsMinY = bodyMaxY + 1

  return `You are a pixel artist. Canvas: ${width}×${height} grid. Origin top-left: x 0–${width - 1}, y 0–${height - 1}.
Palette: ${palette.join(', ')}.

OUTPUT: ONLY a raw JSON array — no markdown, no fences, no explanation.
Format: [{"x":number,"y":number,"color":"#hexcode"},...]

HARD RULES:
- At least ${minPixels} pixels (fill solid regions, NOT just outlines).
- At least 3 different colors.
- Center the subject around (${cx}, ${cy}).
- Every pixel must be within bounds and use only palette colors.

TECHNIQUE — think in filled rectangles, not outlines:
To paint a 3×2 block at (x:5, y:4): emit one object per cell covering every (x,y) in that rectangle.

SPATIAL ZONES (adapt to subject):
- Head:  y ${0}–${headMaxY},  x centered
- Body:  y ${bodyMinY}–${bodyMaxY}, x wider than head
- Legs:  y ${legsMinY}–${height - 1}, x split into limbs

For each body part: pick a zone, pick a color, fill every cell in that zone.`
}

export const paint = async (
  prompt: string,
  size: GridSize,
  palette: readonly string[],
): Promise<Result<PixelInstruction[]>> => {
  try {
    const raw = await complete(buildSystemPrompt(size, size, palette), prompt)
    return parseInstructions(raw)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { ok: false, error: `Groq request failed: ${message}` }
  }
}
