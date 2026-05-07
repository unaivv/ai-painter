import { useState } from 'react'

interface Props {
  onSubmit: (prompt: string) => void
  loading: boolean
}

export const ChatInput = ({ onSubmit, loading }: Props) => {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (!value.trim()) return
    onSubmit(value)
    setValue('')
  }

  return (
    <div>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
        placeholder="Describe what to paint..."
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Painting...' : 'Paint'}
      </button>
    </div>
  )
}
