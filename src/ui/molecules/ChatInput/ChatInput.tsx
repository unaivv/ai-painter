import { useState } from 'react'

import './ChatInput.css'

type Props = {
  onSubmit: (prompt: string) => void
  loading: boolean
}

export const ChatInput = ({ onSubmit, loading }: Props): JSX.Element => {
  const [value, setValue] = useState('')

  const handleSubmit = (): void => {
    if (!value.trim()) return
    onSubmit(value)
    setValue('')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
  }

  return (
    <div className="chat-input">
      <textarea
        className="chat-input__textarea"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={loading}
        placeholder="Describe what to paint..."
        rows={2}
      />
      <button className="chat-input__button" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Painting…' : 'Paint'}
      </button>
    </div>
  )
}
