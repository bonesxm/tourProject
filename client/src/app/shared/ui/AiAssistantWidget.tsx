import { useState } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'
import { http } from '../api/http'
import { useAuth } from '../auth/AuthContext'

type Msg = { role: 'user' | 'bot'; text: string }

export function AiAssistantWidget() {
  const { accessToken } = useAuth()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'bot',
      text: 'Hi! I can suggest tours by budget, hotels, and best destinations for your отдых.',
    },
  ])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setLoading(true)
    try {
      const { data } = await http.post(
        '/api/ai/chat',
        { message: text },
        accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
      )
      setMessages((m) => [...m, { role: 'bot', text: data.answer || 'Try again, please.' }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'Assistant is unavailable now. Try: Bali under $2000 / family tours / beach resorts.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-5 z-50">
      {open ? (
        <div className="mb-3 w-[22rem] overflow-hidden rounded-3xl border border-white/30 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/90">
          <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="size-4" /> AI Travel Assistant
            </div>
            <button onClick={() => setOpen(false)} className="text-xs opacity-90 hover:opacity-100">
              Close
            </button>
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto p-3 text-sm">
            {messages.map((m, idx) => (
              <div key={idx} className={m.role === 'user' ? 'text-right' : ''}>
                <div
                  className={
                    m.role === 'user'
                      ? 'inline-block rounded-2xl bg-sky-500 px-3 py-2 text-white'
                      : 'inline-block rounded-2xl bg-slate-100 px-3 py-2 text-slate-700 dark:bg-slate-800 dark:text-slate-100'
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void send()}
              placeholder="Ask about tours, hotels, budget..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
            <button
              onClick={() => void send()}
              className="rounded-xl bg-blue-600 px-3 text-white"
              disabled={loading}
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setOpen((v) => !v)}
        className="grid size-14 place-items-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl transition hover:scale-105"
        aria-label="Open AI assistant"
      >
        <Bot className="size-6" />
      </button>
    </div>
  )
}

