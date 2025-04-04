import { NextResponse } from 'next/server'
import { validateConfig } from 'bot/config'
import { TelegramBotHandler } from 'bot/telegram'
import type TelegramBot from 'node-telegram-bot-api'

export async function POST(request: Request) {
  try {
    const update = (await request.json()) as TelegramBot.Update

    const config = validateConfig()
    const bot = new TelegramBotHandler(config)
    await bot.handleUpdate(update)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error handling telegram webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
