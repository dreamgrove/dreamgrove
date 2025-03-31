import { NextResponse } from 'next/server'
import { addMessage, getApprovedMessages } from 'bot/db'
import { validateConfig } from 'bot/config'
import { TelegramBotHandler } from 'bot/telegram'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, message } = body

    // Basic validation
    if (!username || !message || typeof username !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // Add message to database
    const newMessage = await addMessage({ username, message })

    // Notify admin via Telegram
    const config = validateConfig()
    const bot = new TelegramBotHandler(config)
    await bot.notifyNewMessage(newMessage)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error handling guestbook message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const messages = await getApprovedMessages()
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching guestbook messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
