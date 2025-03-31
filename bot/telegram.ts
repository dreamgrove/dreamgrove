import TelegramBot from 'node-telegram-bot-api'
import { BotConfig } from './config'
import { GuestbookMessage } from './types'
import { updateMessageStatus } from './db'

export class TelegramBotHandler {
  private bot: TelegramBot
  private adminChatId: string

  constructor(config: BotConfig) {
    this.bot = new TelegramBot(config.telegramToken, {
      polling: false, // We'll use webhooks in production
    })
    this.adminChatId = config.adminChatId
  }

  async notifyNewMessage(message: GuestbookMessage): Promise<void> {
    const text = `New guestbook message!\n\nFrom: ${message.username}\nMessage: ${message.message}\n\nApprove or reject?`

    await this.bot.sendMessage(this.adminChatId, text, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '✅ Approve',
              callback_data: `approve:${message.id}`,
            },
            {
              text: '❌ Reject',
              callback_data: `reject:${message.id}`,
            },
          ],
        ],
      },
    })
  }

  async handleCallback(callbackQuery: TelegramBot.CallbackQuery): Promise<void> {
    const [action, messageId] = (callbackQuery.data || '').split(':')

    if (!messageId || (action !== 'approve' && action !== 'reject')) {
      return
    }

    const status = action === 'approve' ? 'approved' : 'rejected'
    await updateMessageStatus(messageId, status)

    const responseText = `Message ${status}! ✨`
    await this.bot.editMessageText(responseText, {
      chat_id: callbackQuery.message?.chat.id,
      message_id: callbackQuery.message?.message_id,
    })
  }

  // Method to handle webhook updates
  async handleUpdate(update: TelegramBot.Update): Promise<void> {
    if (update.callback_query) {
      await this.handleCallback(update.callback_query)
    }
  }
}
