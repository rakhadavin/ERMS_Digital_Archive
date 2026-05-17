import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, ChevronRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { simulateChatbot } from '../services/chatbotService.js'
import { Badge, sifatVariant } from './ui.jsx'

const WELCOME = {
  id: 'welcome',
  role: 'bot',
  intent: 'welcome',
  text: 'Halo! Saya asisten pencarian arsip **MetaLexicon**.\n\nContoh query:\n• "dokumen moneter rahasia 2024"\n• "working paper tahun 2024"\n• "arsip yang mau habis retensi"\n• "semua dokumen makroprudensial"',
  docs: [],
}

// ─── Rich text renderer (supports **bold** and • bullets) ────────────────────
function RichText({ text }) {
  return (
    <span className="text-[12.5px] text-gray-700 leading-relaxed">
      {text.split('\n').map((line, i) => {
        const isBullet = line.startsWith('•')
        const content = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="font-semibold text-gray-900">{part}</strong> : part
        )
        return isBullet ? (
          <span key={i} className="flex gap-1.5 mt-0.5">
            <span className="text-brand-400 mt-px shrink-0">•</span>
            <span>{content.map((p, j) => typeof p === 'string' ? p.slice(p.startsWith('•') ? 1 : 0).trim() : p)}</span>
          </span>
        ) : (
          <span key={i} className="block">{content}</span>
        )
      })}
    </span>
  )
}

// ─── Document card inside chat ────────────────────────────────────────────────
function DocCard({ doc, onNavigate }) {
  return (
    <button
      onClick={onNavigate}
      className="w-full text-left bg-white border border-gray-100 rounded-xl p-2.5 hover:border-brand-200 hover:bg-brand-50/50 transition-colors group"
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11.5px] font-semibold text-gray-800 leading-snug line-clamp-2">{doc.title}</p>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{doc.nomor}</p>
        </div>
        <ChevronRight size={11} className="text-gray-300 group-hover:text-brand-400 shrink-0 mt-1 transition-colors" />
      </div>
      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
        <span className="text-[9.5px] bg-brand-50 text-brand-600 font-semibold px-1.5 py-0.5 rounded">{doc.mc}</span>
        <span className="text-[9.5px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded font-mono">{doc.sc}</span>
        <Badge variant={sifatVariant(doc.sifat)}>{doc.sifat}</Badge>
        <span className="ml-auto text-[9.5px] text-gray-400 tabular-nums">{new Date(doc.tanggal).getFullYear()}</span>
      </div>
    </button>
  )
}

// ─── Bot message bubble ───────────────────────────────────────────────────────
function BotMessage({ msg, navigate }) {
  const shown = msg.docs.slice(0, 5)
  const remaining = msg.docs.length - 5

  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="w-6 h-6 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 mt-0.5">
        <Bot size={12} className="text-brand-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3 py-2.5">
          <RichText text={msg.text} />
        </div>
        {shown.length > 0 && (
          <div className="mt-2 flex flex-col gap-1.5">
            {shown.map(doc => (
              <DocCard key={doc.id} doc={doc} onNavigate={() => navigate('/dokumen')} />
            ))}
            {remaining > 0 && (
              <button
                onClick={() => navigate('/dokumen')}
                className="text-[11px] text-brand-600 hover:text-brand-800 font-medium py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
              >
                +{remaining} dokumen lainnya — buka Daftar Dokumen →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── User message bubble ──────────────────────────────────────────────────────
function UserMessage({ text }) {
  return (
    <div className="flex justify-end mb-3">
      <div className="bg-brand-400 text-white rounded-2xl rounded-tr-sm px-3 py-2 text-[12.5px] max-w-[82%] leading-relaxed">
        {text}
      </div>
    </div>
  )
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="w-6 h-6 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 mt-0.5">
        <Bot size={12} className="text-brand-600" />
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3 py-3">
        <div className="flex gap-1 items-center">
          {[0, 150, 300].map(delay => (
            <span
              key={delay}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Chatbot component ───────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 280)
  }, [open])

  const handleSend = () => {
    const q = input.trim()
    if (!q || isTyping) return
    setInput('')
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: q }])
    setIsTyping(true)
    const delay = 600 + Math.random() * 400
    setTimeout(() => {
      const response = simulateChatbot(q)
      setIsTyping(false)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', ...response }])
    }, delay)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <>
      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        {open ? (
          <button
            onClick={() => setOpen(false)}
            aria-label="Tutup asisten"
            className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-800 shadow-xl flex items-center justify-center transition-all duration-200"
          >
            <X size={16} className="text-white" />
          </button>
        ) : (
          <div className="relative">
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full bg-brand-400/30 animate-ping" />
            <button
              onClick={() => setOpen(true)}
              aria-label="Buka asisten pencarian"
              className="relative flex items-center gap-2 bg-brand-400 hover:bg-brand-600 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-lg shadow-brand-400/40 hover:shadow-xl hover:shadow-brand-400/50 hover:scale-[1.03] transition-all duration-200"
            >
              <Sparkles size={14} className="shrink-0" />
              <span className="text-[13px] font-semibold tracking-wide whitespace-nowrap">Tanya AI</span>
            </button>
          </div>
        )}
      </div>

      {/* Chat panel */}
      <div
        className={`fixed bottom-[5.5rem] right-6 z-40 w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden
          transition-all duration-300 ease-out
          ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}`}
        style={{ height: 520 }}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center">
            <Bot size={14} className="text-brand-600" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-900 leading-tight">AI Archive Assistant</p>
            <p className="text-[10px] text-gray-400">Cari dokumen dengan bahasa natural</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-gray-400">Aktif</span>
          </div>
        </div>

        {/* Message list */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 pt-3 pb-1 scroll-smooth">
          {messages.map(msg =>
            msg.role === 'user'
              ? <UserMessage key={msg.id} text={msg.text} />
              : <BotMessage key={msg.id} msg={msg} navigate={navigate} />
          )}
          {isTyping && <TypingIndicator />}
        </div>

        {/* Input bar */}
        <div className="shrink-0 border-t border-gray-100 px-3 py-2.5 flex items-center gap-2 bg-white">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan..."
            className="flex-1 text-[12.5px] bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-brand-200 focus:bg-white transition-colors placeholder:text-gray-300"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-xl bg-brand-400 flex items-center justify-center hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>
    </>
  )
}
