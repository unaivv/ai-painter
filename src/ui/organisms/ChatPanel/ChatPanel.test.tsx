import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatPanel } from './ChatPanel'

describe('ChatPanel', () => {
  it('does not render error message when error is null', () => {
    render(<ChatPanel onSubmit={vi.fn()} loading={false} error={null} />)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('renders error message when error is provided', () => {
    render(<ChatPanel onSubmit={vi.fn()} loading={false} error="Groq request failed" />)
    expect(screen.getByRole('alert')).toBeDefined()
    expect(screen.getByRole('alert').textContent).toContain('Groq request failed')
  })

  it('passes loading prop to ChatInput', () => {
    render(<ChatPanel onSubmit={vi.fn()} loading={true} error={null} />)
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })
})
