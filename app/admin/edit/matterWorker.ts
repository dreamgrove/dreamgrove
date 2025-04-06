import matter from 'gray-matter'

// TypeScript worker setup
const ctx: Worker = self as any

// Listen for messages from the main thread
ctx.addEventListener('message', (event) => {
  if (event.data.type === 'parse') {
    try {
      const { data, content } = matter(event.data.content || '')

      // Send the parsed content back to the main thread
      ctx.postMessage({
        type: 'parseResult',
        content,
        data,
      })
    } catch (err) {
      // If parsing fails, send back an error
      ctx.postMessage({
        type: 'error',
        message: err instanceof Error ? err.message : 'Unknown parsing error',
      })
    }
  }
})

// Export empty to satisfy TypeScript module requirements
export {}
