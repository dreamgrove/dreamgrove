import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { encodeUploads, type PendingImage } from '@/lib/admin/imageUploads'
import { clearNewPage } from '@/lib/admin/newPageStash'

const REDIRECT_DELAY_MS = 2000

/** Where to go after a local dev save, which commits to a local branch instead of opening a PR */
function afterSave(filePath: string) {
  const isCompendium = filePath.endsWith('/compendium.mdx') && filePath.includes('blog/')
  return isCompendium ? `/blog/${filePath.split('/').slice(1, -1).join('/')}/compendium` : '/cms'
}

/** Submits the document and its images to GitHub as a pull request */
export function useSaveChanges({
  filePath,
  uploads,
  onSaved,
}: {
  filePath: string
  uploads: Map<string, PendingImage>
  /** Called with the document that was committed */
  onSaved: (content: string) => void
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [prUrl, setPrUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  // Shown over the editor, so a refused save (e.g. the open-PR cap) keeps the user's work on screen
  const [error, setError] = useState<string | null>(null)

  const save = async (content: string, commitTitle: string, commitMessage: string) => {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const images = await encodeUploads(content, uploads)
      const res = await fetch('/api/compendium/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, content, images, commitTitle, commitMessage }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `Error saving content: ${res.statusText}`)

      // The server stamps lastmod, so the committed bytes can differ from what was sent
      onSaved(typeof data.content === 'string' ? data.content : content)
      clearNewPage(filePath)

      if (data.prUrl) {
        setPrUrl(data.prUrl)
        setTimeout(() => (window.location.href = data.prUrl), REDIRECT_DELAY_MS)
      } else if (data.message) {
        setMessage(data.message)
        setTimeout(() => router.push(afterSave(filePath)), REDIRECT_DELAY_MS)
      } else {
        router.push('/cms')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setSaving(false)
    }
  }

  return { save, saving, prUrl, message, error, dismissError: () => setError(null) }
}
