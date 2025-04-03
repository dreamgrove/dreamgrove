'use client'

import { useState, useEffect } from 'react'

interface MDXPreviewProps {
  content: string
}

export default function MDXPreview({ content }: MDXPreviewProps) {
  const [processedContent, setProcessedContent] = useState<string>(content)

  // Process Wowhead syntax (!spellId|Name!)
  useEffect(() => {
    if (!content) return

    // Simple regex to find Wowhead syntax
    const wowheadPattern = /!(\d+)\|(.*?)!/g
    const processedText = content.replace(
      wowheadPattern,
      (_, spellId, name) =>
        `<span class="wowhead-link text-[#1a9c82]" data-wowhead="${spellId}">${name}</span>`
    )

    setProcessedContent(processedText)
  }, [content])

  return (
    <div className="mdx-preview text-gray-800 dark:text-gray-200">
      <div className="prose prose-lg dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      </div>
    </div>
  )
}
