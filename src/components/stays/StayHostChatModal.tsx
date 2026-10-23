'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { StayHostProfile } from '@/lib/stays-data'
import { StayHostMessage, StayHostThread } from '@/lib/stays/messages-store'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface StayHostChatModalProps {
  propertySlug: string
  propertyName: string
  host: StayHostProfile
  isOpen: boolean
  onClose: () => void
  initialGuestName?: string
  initialGuestPhone?: string
}

const PRE_ARRIVAL_OPTIONS = [
  '🏔️ 4x4 Snow Chain Transfer',
  '⏰ Early Check-in (12 PM)',
  '🔥 Pre-Warm Bukhari Fireplace',
  '🌱 Pure Vegetarian / Jain Diet',
  '🚗 Airport Chauffeur Pickup',
  '👶 Baby Cot & High Chair',
]

export default function StayHostChatModal({
  propertySlug,
  propertyName,
  host,
  isOpen,
  onClose,
  initialGuestName = '',
  initialGuestPhone = '',
}: StayHostChatModalProps) {
  const [messages, setMessages] = useState<StayHostMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [selectedChips, setSelectedChips] = useState<string[]>([])
  const [guestName, setGuestName] = useState(initialGuestName || 'Guest')
  const [guestPhone, setGuestPhone] = useState(initialGuestPhone || '+91 98000 00000')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // Fetch thread on open
  useEffect(() => {
    if (!isOpen) return

    fetch(
      `/api/stays/messages?slug=${encodeURIComponent(propertySlug)}&phone=${encodeURIComponent(
        guestPhone,
      )}&name=${encodeURIComponent(guestName)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.thread?.messages) {
          setMessages(data.thread.messages)
        }
      })
      .catch(() => {})
  }, [isOpen, propertySlug, guestPhone, guestName])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    )
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim() && selectedChips.length === 0) return

    const combinedMsg = inputText.trim()
      ? inputText.trim()
      : `Pre-arrival requests: ${selectedChips.join(', ')}`

    const tagsToSend = [...selectedChips]
    setInputText('')
    setSelectedChips([])
    setIsSending(true)

    // Optimistic guest bubble
    const optimisticGuestMsg: StayHostMessage = {
      id: `msg-opt-${Date.now()}`,
      threadId: 'local',
      sender: 'guest',
      senderName: guestName,
      message: combinedMsg,
      timestamp: new Date().toISOString(),
      preArrivalTags: tagsToSend.length > 0 ? tagsToSend : undefined,
    }
    setMessages((prev) => [...prev, optimisticGuestMsg])

    try {
      const res = await fetch('/api/stays/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertySlug,
          guestName,
          guestPhone,
          message: combinedMsg,
          preArrivalTags: tagsToSend,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        if (data.automatedReply) {
          // Delay reply slightly for realistic natural response feel
          setTimeout(() => {
            setMessages((prev) => [...prev, data.automatedReply])
          }, 600)
        }
      }
    } catch {
      // Keep optimistic message
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg h-[640px] max-h-[90vh] flex flex-col border border-[#E7E2D9] shadow-2xl overflow-hidden animate-fadeIn">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="p-4 bg-[#17233B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#C9A45C] flex-shrink-0">
              <Image src={host.avatar} alt={host.name} fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <strong className="font-serif text-sm tracking-wide">{host.name}</strong>
                {host.superhost && (
                  <span className="text-[10px] bg-[#C9A45C] text-[#17233B] px-1.5 py-0.2 rounded-md font-bold">
                    Superhost
                  </span>
                )}
              </div>
              <p className="text-[10px] text-stone-300">
                Estate Host · {propertyName} · Responds {host.responseTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                `Hello! I am chatting with host ${host.name} regarding ${propertyName}.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Switch to WhatsApp"
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
            >
              WhatsApp
            </a>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-300 hover:text-white p-1 text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Pre-Arrival Chips Bar ─────────────────────────────────────────── */}
        <div className="p-2.5 bg-[#FAF8F5] border-b border-stone-200 overflow-x-auto flex items-center gap-1.5 text-xs flex-shrink-0">
          <span className="text-[10px] uppercase font-bold text-stone-400 mr-1 flex-shrink-0">
            Quick Add:
          </span>
          {PRE_ARRIVAL_OPTIONS.map((chip, idx) => {
            const isSelected = selectedChips.includes(chip)
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleChip(chip)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#17233B] text-white shadow-2xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                }`}
              >
                {chip}
              </button>
            )
          })}
        </div>

        {/* ── Messages Scroll Area ─────────────────────────────────────────── */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FCFBF9]">
          {messages.map((m) => {
            const isGuest = m.sender === 'guest'
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isGuest ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-stone-400 mb-0.5 px-1 font-medium">
                  {m.senderName}
                </span>
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed space-y-1.5 shadow-2xs ${
                    isGuest
                      ? 'bg-[#17233B] text-white rounded-br-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                  }`}
                >
                  <p>{m.message}</p>
                  {m.preArrivalTags && m.preArrivalTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-white/20">
                      {m.preArrivalTags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] px-2 py-0.5 rounded-md bg-white/20 text-white font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Composer ───────────────────────────────────────────────── */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-200 space-y-2">
          {selectedChips.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-stone-500 font-bold">Attached requests:</span>
              {selectedChips.map((c, i) => (
                <span key={i} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                  {c}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Ask ${host.name} about arrivals, food, or amenities...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 p-2.5 text-xs bg-[#FAF8F5] border border-stone-200 rounded-xl focus:outline-none focus:border-[#17233B]"
            />
            <button
              type="submit"
              disabled={isSending || (!inputText.trim() && selectedChips.length === 0)}
              className="px-4 py-2.5 bg-[#17233B] hover:bg-[#1E3048] disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
