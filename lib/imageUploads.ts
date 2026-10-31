// Images uploaded from the Image block.
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024
export const MAX_TOTAL_BYTES = 3 * 1024 * 1024

export const IMAGE_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export const UPLOAD_PATH_RE =
  /^\/static\/images\/uploads\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\.(?:png|jpg|webp|gif)$/

export interface PendingImage {
  file: File
  url: string
}

export interface ImageUploads {
  add: (file: File) => string
  previewUrl: (src: string) => string | undefined
}

function slug(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'image'
  )
}

/** blog/balance/compendium.mdx + Moon Guide.PNG → /static/images/uploads/blog/balance/moon-guide-x7k2.png */
export function uploadPath(docPath: string, file: File) {
  const ext = IMAGE_TYPES[file.type]
  if (!ext) throw new Error('Only PNG, JPG, WebP and GIF images can be uploaded')
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Images must be 2 MB or smaller')
  const dir = docPath.split('/').slice(0, -1).map(slug).join('/')
  const name = slug(file.name.replace(/\.[^.]+$/, ''))
  const suffix = Math.random().toString(36).slice(2, 6)
  return `/static/images/uploads/${dir ? `${dir}/` : ''}${name}-${suffix}.${ext}`
}

export async function encodeUploads(document: string, pending: Map<string, PendingImage>) {
  const used = [...pending].filter(([path]) => document.includes(path))
  const total = used.reduce((sum, [, img]) => sum + img.file.size, 0)
  if (total > MAX_TOTAL_BYTES) {
    throw new Error('Uploaded images add up to more than 3 MB; save some in a separate PR')
  }
  return Promise.all(
    used.map(async ([path, { file }]) => {
      const bytes = new Uint8Array(await file.arrayBuffer())
      let binary = ''
      for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
      }
      return { path, content: btoa(binary) }
    })
  )
}
