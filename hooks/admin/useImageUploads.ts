import { useEffect, useMemo, useState } from 'react'
import { uploadPath, type ImageUploads, type PendingImage } from '@/lib/admin/imageUploads'
import { useLatest } from './useLatest'

/**
 * Images uploaded from the Image block.
 */
export function useImageUploads(filePath: string) {
  const [uploads, setUploads] = useState<Map<string, PendingImage>>(() => new Map())
  const uploadsRef = useLatest(uploads)
  useEffect(() => {
    const pending = uploadsRef
    return () => pending.current.forEach((img) => URL.revokeObjectURL(img.url))
  }, [uploadsRef])

  const images = useMemo<ImageUploads>(
    () => ({
      add: (file) => {
        const path = uploadPath(filePath, file)
        const url = URL.createObjectURL(file)
        setUploads((prev) => new Map(prev).set(path, { file, url }))
        return path
      },
      previewUrl: (src) => uploads.get(src)?.url,
    }),
    [filePath, uploads]
  )

  return { uploads, images }
}

/** `content` with upload paths pointed at their blobs, which the server doesn't have yet */
export function withUploadUrls(content: string, uploads: Map<string, PendingImage>) {
  return [...uploads].reduce((doc, [path, img]) => doc.split(path).join(img.url), content)
}
