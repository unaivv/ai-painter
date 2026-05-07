import type { PixelInstruction } from '@/domain/canvas/PixelInstruction'

export type Result<T> = { ok: true; value: T } | { ok: false; error: string }

const extractJsonArray = (raw: string): string => {
  const start = raw.indexOf('[')
  const end = raw.lastIndexOf(']')
  if (start === -1 || end === -1 || end < start) return raw
  return raw.slice(start, end + 1)
}

const normalize = (raw: string): string =>
  raw
    .replace(/<think>[\s\S]*?<\/think>/i, '')
    .replace(/^```(?:json)?\n?/m, '')
    .replace(/\n?```$/m, '')
    .trim()

export const parseInstructions = (raw: string): Result<PixelInstruction[]> => {
  if (!raw.trim()) return { ok: false, error: 'Failed to parse: empty response' }

  try {
    const cleaned = extractJsonArray(normalize(raw))
    const parsed: unknown = JSON.parse(cleaned)
    if (!Array.isArray(parsed)) {
      return { ok: false, error: 'Expected an array of pixel instructions' }
    }
    return { ok: true, value: parsed as PixelInstruction[] }
  } catch {
    return { ok: false, error: 'Failed to parse: invalid JSON' }
  }
}
