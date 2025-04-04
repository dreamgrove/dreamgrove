export type BotConfig = {
  telegramToken: string
  adminChatId: string
}

// Environment variables validation
export function validateConfig(): BotConfig {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID

  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is required')
  if (!chatId) throw new Error('TELEGRAM_ADMIN_CHAT_ID is required')

  return {
    telegramToken: token,
    adminChatId: chatId,
  }
}
