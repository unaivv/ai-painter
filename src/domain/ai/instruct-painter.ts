import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'
import type { PixelInstruction } from '@/domain/canvas/PixelInstruction'
import { PICO8_CODES } from '@/domain/palette/pico8'

import { serializeGrid } from './serialize-grid'
import { parseInstructions, type Result } from './parse-instructions'

export type CompleteFn = (system: string, user: string, maxTokens: number) => Promise<string>

const SYSTEM_PROMPT =
  'You are a pixel art editor. The canvas state is shown in ASCII (`.`=empty, letter=Pico-8 color code). ' +
  'Return ONLY a JSON array: [{x,y,color}] where x,y are 0-based coordinates and color is a hex string. ' +
  'Use color "" to erase. Return [] if nothing changes. No prose, no markdown, no code blocks.'

const MAX_GENERATION_TOKENS = 1024
const MAX_DELTA_TOKENS = 256
const CHARS_PER_TOKEN = 3

const isGridEmpty = (grid: CanvasGrid): boolean =>
  grid.cells.every(row => row.every(c => !c))

export const instruct = async (
  grid: CanvasGrid,
  instruction: string,
  complete: CompleteFn,
): Promise<Result<PixelInstruction[]>> => {
  const ascii = serializeGrid(grid, PICO8_CODES)
  const generating = isGridEmpty(grid)
  const user = `${ascii}\n${generating ? 'Draw' : 'Edit'}: ${instruction}`
  const paintBudget = Math.ceil((grid.width * (grid.width + 1)) / CHARS_PER_TOKEN)
  const maxTokens = generating
    ? MAX_GENERATION_TOKENS
    : Math.min(MAX_DELTA_TOKENS, paintBudget - 1)
  const raw = await complete(SYSTEM_PROMPT, user, maxTokens)
  return parseInstructions(raw)
}
