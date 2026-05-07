import { ChatInput } from '@/ui/molecules/ChatInput/ChatInput'

type Props = {
  onSubmit: (prompt: string) => void
  loading: boolean
  error: string | null
}

export const ChatPanel = ({ onSubmit, loading, error }: Props): JSX.Element => (
  <div className="chat-panel">
    {error && (
      <p className="chat-panel__error" role="alert">
        {error}
      </p>
    )}
    <ChatInput onSubmit={onSubmit} loading={loading} />
  </div>
)
