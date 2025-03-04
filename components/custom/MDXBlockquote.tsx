import React from 'react'
import Alert from './Alert'

interface MDXBlockquoteProps {
  children: React.ReactNode
}

const MDXBlockquote: React.FC<MDXBlockquoteProps> = ({ children }) => {
  const logger = console
  logger.info('[MDXBlockquote] Processing blockquote content', {
    origin: 'components/custom/MDXBlockquote.tsx',
  })

  // Check if this is an alert blockquote
  if (React.isValidElement(children) && children.props.children) {
    const childrenArray = React.Children.toArray(children.props.children)

    // Check if the first child is a string and starts with [!
    if (childrenArray.length > 0) {
      const firstChild = childrenArray[0]

      if (typeof firstChild === 'string' && firstChild.trim().startsWith('[!')) {
        // Extract the alert type
        const match = firstChild.trim().match(/^\[!(INFO|WARNING|ERROR|SUCCESS|NOTE)\]/i)

        if (match) {
          const alertType = match[1].toLowerCase() as
            | 'info'
            | 'warning'
            | 'error'
            | 'success'
            | 'note'
          logger.info(`[MDXBlockquote] Detected alert type: ${alertType}`, {
            origin: 'components/custom/MDXBlockquote.tsx',
          })

          // Remove the alert type from the content
          const restOfContent = firstChild
            .replace(/^\[!(INFO|WARNING|ERROR|SUCCESS|NOTE)\]/i, '')
            .trim()

          // Create a new array of children without the alert type
          const newChildren = restOfContent
            ? [
                <p key="title" className="markdown-alert-title mb-2 font-medium">
                  {alertType.charAt(0).toUpperCase() + alertType.slice(1)}
                </p>,
                <div key="content" className="alert-content">
                  {restOfContent}
                  {childrenArray.slice(1)}
                </div>,
              ]
            : [
                <p key="title" className="markdown-alert-title mb-2 font-medium">
                  {alertType.charAt(0).toUpperCase() + alertType.slice(1)}
                </p>,
                <div key="content" className="alert-content">
                  {childrenArray.slice(1)}
                </div>,
              ]

          // Return the Alert component with the appropriate type
          return <Alert type={alertType}>{newChildren}</Alert>
        }
      }
    }
  }

  // If not an alert blockquote, render as a regular blockquote
  return (
    <blockquote className="my-6 border-l-4 border-gray-300 pl-4 italic dark:border-gray-700">
      {children}
    </blockquote>
  )
}

export default MDXBlockquote
