import { describe, it, expect } from 'vitest'
import { parseInstructions } from './parse-instructions'

describe('parseInstructions', () => {
  it('parses a valid JSON array', () => {
    const raw = '[{"x":1,"y":2,"color":"#000000"}]'
    const result = parseInstructions(raw)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual([{ x: 1, y: 2, color: '#000000' }])
    }
  })

  it('parses JSON wrapped in markdown code fences', () => {
    const raw = '```json\n[{"x":0,"y":0,"color":"#ff004d"}]\n```'
    const result = parseInstructions(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value[0].color).toBe('#ff004d')
  })

  it('parses JSON wrapped in plain code fences', () => {
    expect(parseInstructions('```\n[{"x":0,"y":0,"color":"#ff004d"}]\n```').ok).toBe(true)
  })

  it('returns error result for invalid JSON', () => {
    const result = parseInstructions('not json at all')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain('Failed to parse')
  })

  it('returns error result for empty string', () => {
    expect(parseInstructions('').ok).toBe(false)
  })

  it('extracts JSON array when surrounded by extra text', () => {
    const raw = 'Here is the pixel art:\n[{"x":0,"y":0,"color":"#ff004d"}]\nHope you like it!'
    const result = parseInstructions(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value[0].color).toBe('#ff004d')
  })

  it('strips <think> tags from reasoning models', () => {
    const raw = '<think>Let me plan the layout...\nHead at top.</think>\n[{"x":0,"y":0,"color":"#ff004d"}]'
    const result = parseInstructions(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value[0].color).toBe('#ff004d')
  })

  it('returns error result when parsed value is not an array', () => {
    const result = parseInstructions('{"x":1,"y":2,"color":"#000000"}')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain('Expected an array')
  })

  it('repairs unquoted keys (JS-style objects)', () => {
    const raw = '[{x:0,y:0,color:"#ff004d"}]'
    const result = parseInstructions(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value[0]).toEqual({ x: 0, y: 0, color: '#ff004d' })
  })

  it('repairs single-quoted values', () => {
    const raw = `[{"x":0,"y":0,"color":'#ff004d'}]`
    const result = parseInstructions(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value[0].color).toBe('#ff004d')
  })

  it('repairs trailing commas', () => {
    const raw = '[{"x":0,"y":0,"color":"#ff004d"},]'
    const result = parseInstructions(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toHaveLength(1)
  })
})
