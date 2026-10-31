import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { encodeUploads, type PendingImage } from '@/lib/admin/imageUploads'
import { clearNewPage } from '@/lib/admin/newPageStash'

const REDIRECT_DELAY_MS = 2000

/** Where to go after a save that didn't open a PR (legacy) */
function afterSave(filePath: string) {
  const isCompendium = filePath.endsWith('/compendium.mdx') && filePath.includes('blog/')
  return isCompendium
    ? `/blog/${filePath.split('/').slice(1, -1).join('/')}/compendium`
    : '/admin/select'
}

/** Submits the document and its images to GitHub as a pull request */
export function useSaveChanges({
  filePath,
  uploads,
  onSaved,
  onFail,
}: {
  filePath: string
  uploads: Map<string, PendingImage>
  /** Called with the document that was committed */
  onSaved: (content: string) => void
  onFail: (status: 'forbidden' | 'error', message?: string) => void
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [prUrl, setPrUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const save = async (content: string, commitTitle: string, commitMessage: string) => {
    setSaving(true)
    setMessage(null)
    try {
      const images = await encodeUploads(content, uploads)
      const res = await fetch('/api/compendium/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath,
          content,
          images,
          commitTitle,
          commitMessage,
          createPr: true,
        }),
      })
      if (res.status === 403) return onFail('forbidden')
      if (!res.ok) throw new Error(`Error saving content: ${res.statusText}`)
      const data = await res.json()

      onSaved(content)
      clearNewPage(filePath)

      if (data.prUrl) {
        setPrUrl(data.prUrl)
        setTimeout(() => (window.location.href = data.prUrl), REDIRECT_DELAY_MS)
      } else if (data.message) {
        setMessage(data.message)
        setTimeout(() => router.push(afterSave(filePath)), REDIRECT_DELAY_MS)
      } else {
        router.push('/admin/select')
      }
    } catch (err) {
      onFail('error', err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setSaving(false)
    }
  }

  return { save, saving, prUrl, message }
}
