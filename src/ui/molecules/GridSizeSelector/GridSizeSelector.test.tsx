import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GridSizeSelector } from './GridSizeSelector'

describe('GridSizeSelector', () => {
  it('renders a select with the current value', () => {
    render(<GridSizeSelector value={16} onChange={vi.fn()} />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('16')
  })

  it('renders options for 16, 32, 64, 100', () => {
    render(<GridSizeSelector value={16} onChange={vi.fn()} />)
    const options = screen.getAllByRole('option')
    expect(options.map(o => (o as HTMLOptionElement).value)).toEqual(['16', '32', '64', '100'])
  })

  it('calls onChange with the numeric GridSize value', async () => {
    const onChange = vi.fn()
    render(<GridSizeSelector value={16} onChange={onChange} />)
    await userEvent.selectOptions(screen.getByRole('combobox'), '32')
    expect(onChange).toHaveBeenCalledWith(32)
  })
})
