'use client'
import border from 'public/static/images/april/border.png'
import { useState, useEffect, useRef } from 'react'
import { GuestbookMessage } from 'bot/types'

const formatRelativeTime = (timestamp: number) => {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  return 'just now'
}

const ChatMessage = ({
  username,
  message,
  time,
}: {
  username: string
  message: string
  time: string
}) => (
  <div className="mb-2 flex flex-col">
    <div className="flex items-baseline gap-2">
      <span className="font-pixel text-sm text-blue-400">{username}</span>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
    <div className="font-pixel text-sm text-[#FF7AAD]">{message}</div>
  </div>
)

export const ChatBox = () => {
  const [messages, setMessages] = useState<GuestbookMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom()
    }
  }, [messages, isLoading])

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/guestbook')
      const data = await response.json()
      // Sort messages by timestamp (oldest first)
      setMessages(Array.isArray(data) ? [...data].sort((a, b) => a.timestamp - b.timestamp) : [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!username.trim() || !newMessage.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, message: newMessage }),
      })

      setNewMessage('')
      // Don't clear username in case they want to post again
      alert('Message submitted! It will appear after approval ✨')
    } catch (error) {
      console.error('Error submitting message:', error)
      alert('Failed to submit message. Please try again!')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="flex h-[350px] min-h-[300px] flex-col px-3 py-2 lg:h-full"
      style={{
        borderStyle: 'solid',
        borderWidth: '7px',
        borderImage: `url(${border.src}) 7 fill round`,
        backgroundColor: 'white',
      }}
    >
      <div className="mb-2 text-center">
        <h2 className="font-pixel mb-1 text-xl font-bold text-[#FF7AAD]">✧ ℊ𝓊ℯ𝓈𝓉𝒷ℴℴ𝓀 ✧</h2>
      </div>
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto rounded-sm border border-pink-200 bg-white/80 p-3"
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <span className="font-pixel text-sm text-[#FF7AAD]">Loading messages...</span>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              username={msg.username}
              message={msg.message}
              time={formatRelativeTime(msg.timestamp)}
            />
          ))
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-pixel text-sm text-[#FF7AAD]">
              No messages yet. Be the first! ✧
            </span>
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-col gap-2 md:flex-row">
        <input
          type="text"
          placeholder="Your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="font-pixel rounded-sm border border-pink-200 bg-white/80 px-3 py-1 text-sm"
        />
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            placeholder="Leave a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="font-pixel flex-1 rounded-sm border border-pink-200 bg-white/80 px-3 py-1 text-sm"
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !username.trim() || !newMessage.trim()}
            className="font-pixel rounded-sm border border-pink-200 bg-white/80 px-3 py-1 text-sm text-[#FF7AAD] disabled:opacity-50"
          >
            Send ✧
          </button>
        </div>
      </div>
    </div>
  )
}
