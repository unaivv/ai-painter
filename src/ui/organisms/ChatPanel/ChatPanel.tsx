import { ChatInput } from '@/ui/molecules/ChatInput/ChatInput'

interface Props {
  onSubmit: (prompt: string) => void
  loading: boolean
  error: string | null
}

export const ChatPanel = ({ onSubmit, loading, error }: Props) => (
  <div>
    {error && <p role="alert">{error}</p>}
    <ChatInput onSubmit={onSubmit} loading={loading} />
  </div>
)
