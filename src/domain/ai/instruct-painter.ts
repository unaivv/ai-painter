import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'
import type { PixelInstruction } from '@/domain/canvas/PixelInstruction'
import { PICO8_CODES } from '@/domain/palette/pico8'

import { serializeGrid } from './serialize-grid'
import { parseInstructions } from './parse-instructions'
import type { Result } from './parse-instructions'

type CompleteFn = (system: string, user: string, maxTokens: number) => Promise<string>

const SYSTEM_PROMPT =
  'You are a pixel art editor. Current canvas in ASCII (`.`=empty, letter=palette). ' +
  'Apply instruction; return ONLY a JSON delta `[{x,y,color}]` (hex or `""` to erase). ' +
  '`[]` if nothing changes. No prose, no markdown.'

export const instruct = async (
  grid: CanvasGrid,
  instruction: string,
  complete: CompleteFn,
): Promise<Result<PixelInstruction[]>> => {
  const ascii = serializeGrid(grid, PICO8_CODES)
  const user = `${ascii}\nEdit: ${instruction}`
  const raw = await complete(SYSTEM_PROMPT, user, 256)
  return parseInstructions(raw)
}
