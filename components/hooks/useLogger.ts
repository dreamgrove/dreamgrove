import { useCallback } from 'react'

type LogLevel = 'info' | 'warn' | 'error'

interface Logger {
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
}

/**
 * A hook that provides logging functionality with component origin information
 * @param origin The name of the component or module using the logger
 * @returns An object with info, warn, and error logging methods
 */
export const useLogger = (origin: string): Logger => {
  const log = useCallback(
    (level: LogLevel, message: string) => {
      const timestamp = new Date().toISOString()
      const prefix = `[${timestamp}] [${level.toUpperCase()}] [${origin}]:`

      switch (level) {
        case 'info':
          console.info(`${prefix} ${message}`)
          break
        case 'warn':
          console.warn(`${prefix} ${message}`)
          break
        case 'error':
          console.error(`${prefix} ${message}`)
          break
      }
    },
    [origin]
  )

  return {
    info: (message: string) => log('info', message),
    warn: (message: string) => log('warn', message),
    error: (message: string) => log('error', message),
  }
}
