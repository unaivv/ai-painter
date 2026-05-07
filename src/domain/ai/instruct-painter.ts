import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'
import type { PixelInstruction } from '@/domain/canvas/PixelInstruction'
import { PICO8_CODES } from '@/domain/palette/pico8'

import { serializeGrid } from './serialize-grid'
import { parseInstructions, type Result } from './parse-instructions'

export type CompleteFn = (system: string, user: string, maxTokens: number) => Promise<string>

const SYSTEM_PROMPT =
  'You are a pixel art editor. Current canvas in ASCII (`.`=empty, letter=palette). ' +
  'Apply instruction; return ONLY a JSON delta `[{x,y,color}]` (hex or `""` to erase). ' +
  '`[]` if nothing changes. No prose, no markdown.'

const MAX_DELTA_TOKENS = 256
const CHARS_PER_TOKEN = 3

export const instruct = async (
  grid: CanvasGrid,
  instruction: string,
  complete: CompleteFn,
): Promise<Result<PixelInstruction[]>> => {
  const ascii = serializeGrid(grid, PICO8_CODES)
  const user = `${ascii}\nEdit: ${instruction}`
  const paintBudget = Math.ceil((grid.width * (grid.width + 1)) / CHARS_PER_TOKEN)
  const maxTokens = Math.min(MAX_DELTA_TOKENS, paintBudget - 1)
  const raw = await complete(SYSTEM_PROMPT, user, maxTokens)
  return parseInstructions(raw)
}
