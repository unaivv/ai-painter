import type { PixelInstruction } from '@/domain/canvas/PixelInstruction'

export type Result<T> = { ok: true; value: T } | { ok: false; error: string }

const stripFences = (raw: string): string =>
  raw
    .replace(/<think>[\s\S]*?<\/think>/i, '')
    .replace(/^```(?:json)?\n?/m, '')
    .replace(/\n?```$/m, '')
    .trim()

export const parseInstructions = (raw: string): Result<PixelInstruction[]> => {
  if (!raw.trim()) return { ok: false, error: 'Failed to parse: empty response' }

  try {
    const cleaned = stripFences(raw)
    const parsed: unknown = JSON.parse(cleaned)
    if (!Array.isArray(parsed)) {
      return { ok: false, error: 'Expected an array of pixel instructions' }
    }
    return { ok: true, value: parsed as PixelInstruction[] }
  } catch {
    return { ok: false, error: 'Failed to parse: invalid JSON' }
  }
}
