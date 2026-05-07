import Groq from 'groq-sdk'

const MODEL = 'qwen/qwen3-32b' as const

const client = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true })

export const complete = async (system: string, user: string): Promise<string> => {
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    max_tokens: 8192,
  })
  return response.choices[0]?.message?.content ?? ''
}
