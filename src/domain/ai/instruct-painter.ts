import type { CanvasGrid } from '@/domain/canvas/CanvasGrid'
import type { PixelInstruction } from '@/domain/canvas/PixelInstruction'
import { PICO8_PALETTE, PICO8_CODES } from '@/domain/palette/pico8'

import { serializeGrid } from './serialize-grid'
import { parseInstructions, type Result } from './parse-instructions'

export type CompleteFn = (system: string, user: string, maxTokens: number) => Promise<string>

const PALETTE_LIST = PICO8_PALETTE.join(' ')
const COLOR_KEY = Object.entries(PICO8_CODES).map(([k, v]) => `${k}=${v}`).join(' ')

const DRAW_SYSTEM_PROMPT =
  'You are a pixel artist. Create pixel art on a blank ASCII canvas.\n' +
  'Respond with ONLY a JSON array — no prose, no markdown, no code blocks.\n' +
  `Example: [{"x":0,"y":0,"color":"#ff004d"},{"x":1,"y":0,"color":"#ffa300"}]\n` +
  `Available colors: ${PALETTE_LIST}\n` +
  'Use x=column, y=row (0-indexed). Draw at least 15 pixels.'

const EDIT_SYSTEM_PROMPT =
  `You are a pixel art editor. The canvas is ASCII (. = empty; ${COLOR_KEY}).\n` +
  'Respond with ONLY a JSON array of changed pixels — no prose, no markdown, no code blocks.\n' +
  `Example: [{"x":3,"y":5,"color":"#ff004d"}]\n` +
  'Use color "" to erase. Return [] if nothing changes.'

const MAX_TOKENS = 1024
const TOKENS_PER_PIXEL = 12

const isGridEmpty = (grid: CanvasGrid): boolean =>
  grid.cells.every(row => row.every(c => !c))

const deltaTokenBudget = (grid: CanvasGrid): number =>
  Math.min(MAX_TOKENS, grid.height * TOKENS_PER_PIXEL * 2)

export const instruct = async (
  grid: CanvasGrid,
  instruction: string,
  complete: CompleteFn,
): Promise<Result<PixelInstruction[]>> => {
  const generating = isGridEmpty(grid)
  const ascii = serializeGrid(grid, PICO8_CODES)
  const systemPrompt = generating ? DRAW_SYSTEM_PROMPT : EDIT_SYSTEM_PROMPT
  const user = `${ascii}\n${generating ? 'Draw' : 'Edit'}: ${instruction}`
  const maxTokens = generating ? MAX_TOKENS : deltaTokenBudget(grid)
  const raw = await complete(systemPrompt, user, maxTokens)
  const result = parseInstructions(raw)
  if (generating && result.ok && result.value.length === 0) {
    return { ok: false, error: 'Nothing was drawn — try describing the image in more detail' }
  }
  return result
}
