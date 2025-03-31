import { createClient } from 'redis'
import { GuestbookMessage } from './types'

const MESSAGES_KEY = 'guestbook:messages'

// Global client instance
let client: ReturnType<typeof createClient> | null = null

// Create Redis client with connection caching
const getRedisClient = async () => {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
    })
  }

  if (!client.isOpen) {
    await client.connect()
  }

  return client
}

export async function addMessage(
  message: Omit<GuestbookMessage, 'id' | 'status' | 'timestamp'>
): Promise<GuestbookMessage> {
  const client = await getRedisClient()
  const id = Date.now().toString()
  const newMessage: GuestbookMessage = {
    ...message,
    id,
    status: 'pending',
    timestamp: Date.now(),
  }

  await client.hSet(MESSAGES_KEY, id, JSON.stringify(newMessage))
  return newMessage
}

export async function updateMessageStatus(
  id: string,
  status: GuestbookMessage['status']
): Promise<void> {
  const client = await getRedisClient()
  const messageStr = await client.hGet(MESSAGES_KEY, id)
  if (!messageStr) throw new Error('Message not found')

  const message: GuestbookMessage = JSON.parse(messageStr)
  const updatedMessage = { ...message, status }

  await client.hSet(MESSAGES_KEY, id, JSON.stringify(updatedMessage))
}

export async function getApprovedMessages(): Promise<GuestbookMessage[]> {
  const client = await getRedisClient()
  try {
    const messages = await client.hGetAll(MESSAGES_KEY)
    if (!messages) return []

    return Object.entries(messages)
      .map(([_, value]) => {
        try {
          return JSON.parse(value) as GuestbookMessage
        } catch {
          return null
        }
      })
      .filter((msg): msg is GuestbookMessage => msg !== null && msg.status === 'approved')
      .sort((a, b) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}
