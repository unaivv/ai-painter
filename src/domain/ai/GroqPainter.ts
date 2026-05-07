import { complete } from '@/infrastructure/groq/GroqClient'
import { parseInstructions } from './parseInstructions'
import type { Result } from './parseInstructions'
import type { GridSize, PixelInstruction } from '@/domain/canvas/PixelInstruction'

const buildSystemPrompt = (width: GridSize, height: GridSize, palette: readonly string[]): string =>
  `You are a pixel art painter. The canvas is ${width}x${height} cells (x: 0-${width - 1}, y: 0-${height - 1}).
Available colors: ${palette.join(', ')}.
Respond with ONLY a valid JSON array of pixel instructions. No explanation, no markdown, no code fences.
Format: [{"x": number, "y": number, "color": "#hexcode"}, ...]
Use only the provided colors. Stay within canvas bounds.`

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
