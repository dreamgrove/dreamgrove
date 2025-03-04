import React from 'react'
import {
  FaInfoCircle,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaCheckCircle,
  FaLightbulb,
} from 'react-icons/fa'
import clsx from 'clsx'

type AlertType = 'info' | 'warning' | 'error' | 'success' | 'note'

interface AlertProps {
  type: AlertType
  title?: string
  children: React.ReactNode
}

const Alert: React.FC<AlertProps> = ({ type, title, children }) => {
  const logger = console
  logger.info(`[Alert] Rendering alert of type: ${type}`, { origin: 'components/custom/Alert.tsx' })

  const icons = {
    info: <FaInfoCircle className="h-5 w-5" />,
    warning: <FaExclamationTriangle className="h-5 w-5" />,
    error: <FaExclamationCircle className="h-5 w-5" />,
    success: <FaCheckCircle className="h-5 w-5" />,
    note: <FaLightbulb className="h-5 w-5" />,
  }

  const styles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800',
    warning:
      'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800',
    error:
      'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800',
    success:
      'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800',
    note: 'bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-800/30 dark:text-gray-200 dark:border-gray-700',
  }

  const iconStyles = {
    info: 'text-blue-500 dark:text-blue-400',
    warning: 'text-yellow-500 dark:text-yellow-400',
    error: 'text-red-500 dark:text-red-400',
    success: 'text-green-500 dark:text-green-400',
    note: 'text-gray-500 dark:text-gray-400',
  }

  // Check if children already contains a markdown-alert-title
  const hasMarkdownAlertTitle = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) && child.props.className?.includes('markdown-alert-title')
  )

  const titleText = title || type.charAt(0).toUpperCase() + type.slice(1)

  return (
    <div className={clsx('my-6 rounded-lg border p-4', styles[type])}>
      <div className="flex items-start">
        <div className={clsx('mr-3 flex-shrink-0 pt-1', iconStyles[type])}>{icons[type]}</div>
        <div className="w-full">
          {!hasMarkdownAlertTitle && title && (
            <p className="markdown-alert-title mb-2 font-medium">{titleText}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export default Alert
