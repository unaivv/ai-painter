import type { PixelInstruction } from '@/domain/canvas/PixelInstruction'

export type Result<T> = { ok: true; value: T } | { ok: false; error: string }

const normalize = (raw: string): string =>
  raw
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1')
    .trim()

const extractJsonArray = (raw: string): string => {
  const start = raw.indexOf('[')
  const end = raw.lastIndexOf(']')
  if (start === -1 || end === -1 || end < start) return raw
  return raw.slice(start, end + 1)
}

const repairJson = (s: string): string =>
  s
    .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3')
    .replace(/:\s*'([^']*)'/g, ': "$1"')
    .replace(/,(\s*[}\]])/g, '$1')

export const parseInstructions = (raw: string): Result<PixelInstruction[]> => {
  if (!raw.trim()) return { ok: false, error: 'Failed to parse: empty response' }

  try {
    const cleaned = repairJson(extractJsonArray(normalize(raw)))
    const parsed: unknown = JSON.parse(cleaned)
    if (!Array.isArray(parsed)) {
      return { ok: false, error: 'Expected an array of pixel instructions' }
    }
    return { ok: true, value: parsed as PixelInstruction[] }
  } catch {
    return { ok: false, error: 'Failed to parse: invalid JSON' }
  }
}
