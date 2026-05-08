import { useState } from 'react'

import styles from './ChatInput.module.css'

type Props = {
  onSubmit: (prompt: string) => void
  loading: boolean
}

type ViewProps = {
  value: string
  loading: boolean
  onChange: (v: string) => void
  onSubmit: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

const ChatInputView = ({ value, loading, onChange, onSubmit, onKeyDown }: ViewProps): JSX.Element => (
  <div className={styles.chatInput}>
    <textarea
      className={styles.textarea}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={loading}
      placeholder="Describe what to paint… (Enter to send, Shift+Enter for newline)"
      rows={1}
    />
    <button className={styles.button} onClick={onSubmit} disabled={loading}>
      {loading ? 'Painting…' : 'Paint'}
    </button>
  </div>
)

export const ChatInput = ({ onSubmit, loading }: Props): JSX.Element => {
  const [value, setValue] = useState('')

  const handleSubmit = (): void => {
    if (!value.trim()) return
    onSubmit(value)
    setValue('')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return <ChatInputView value={value} loading={loading} onChange={setValue} onSubmit={handleSubmit} onKeyDown={handleKey} />
}
