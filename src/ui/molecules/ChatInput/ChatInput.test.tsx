import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatInput } from './ChatInput'

describe('ChatInput', () => {
  it('renders textarea and submit button', () => {
    render(<ChatInput onSubmit={vi.fn()} loading={false} />)
    expect(screen.getByRole('textbox')).toBeDefined()
    expect(screen.getByRole('button', { name: /paint/i })).toBeDefined()
  })

  it('disables button and textarea when loading', () => {
    render(<ChatInput onSubmit={vi.fn()} loading={true} />)
    expect(screen.getByRole('button', { name: /painting/i })).toBeDefined()
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).disabled).toBe(true)
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })

  it('calls onSubmit with typed text', async () => {
    const onSubmit = vi.fn()
    render(<ChatInput onSubmit={onSubmit} loading={false} />)
    await userEvent.type(screen.getByRole('textbox'), 'a sunset')
    await userEvent.click(screen.getByRole('button'))
    expect(onSubmit).toHaveBeenCalledWith('a sunset')
  })

  it('clears input after submit', async () => {
    render(<ChatInput onSubmit={vi.fn()} loading={false} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    await userEvent.click(screen.getByRole('button'))
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('')
  })

  it('does not submit when input is empty', async () => {
    const onSubmit = vi.fn()
    render(<ChatInput onSubmit={onSubmit} loading={false} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
