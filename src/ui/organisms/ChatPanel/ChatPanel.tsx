import { ChatInput } from '@/ui/molecules/ChatInput/ChatInput'

import styles from './ChatPanel.module.css'

type Props = {
  onSubmit: (prompt: string) => void
  loading: boolean
  error: string | null
  onDismissError?: () => void
}

export const ChatPanel = ({ onSubmit, loading, error, onDismissError }: Props): JSX.Element => (
  <div className={styles.panel}>
    {error && (
      <div className={styles.error} role="alert">
        <span>{error}</span>
        {onDismissError && (
          <button className={styles.dismiss} onClick={onDismissError} aria-label="Dismiss error">
            ×
          </button>
        )}
      </div>
    )}
    <ChatInput onSubmit={onSubmit} loading={loading} />
  </div>
)
