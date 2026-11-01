'use client'

import { useRef, useState } from 'react'
import { IMAGE_TYPES, type ImageUploads } from '@/lib/admin/imageUploads'
import Icon from '@/components/Icon'
import { INPUT } from '@/components/admin/ui/styles'

/** Image path input with upload, paste and drag and drop + a preview */
export default function ImageInput({
  id,
  value,
  placeholder,
  images,
  onChange,
}: {
  id: string
  value: string
  placeholder?: string
  images: ImageUploads
  onChange: (v: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const previewSrc = images.previewUrl(value) ?? (/^(\/|https?:)/.test(value) ? value : '')

  const take = (file: File | undefined) => {
    if (!file) return
    try {
      onChange(images.add(file))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        take(e.dataTransfer.files[0])
      }}
      className={`rounded-md transition-shadow ${dragging ? 'ring-2 ring-main' : ''}`}
    >
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={(e) => {
            const file = [...e.clipboardData.files].find((f) => f.type.startsWith('image/'))
            if (file) {
              e.preventDefault()
              take(file)
            }
          }}
          placeholder={placeholder}
          spellCheck={false}
          className={`${INPUT} min-w-0 font-mono text-[.82rem]`}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex h-[38px] flex-shrink-0 items-center gap-1.5 rounded-md border border-[#525252] pr-3.5 pl-3 text-[.875rem] font-medium text-[#e5e5e5] transition-colors hover:bg-[#2e2e2e]"
        >
          <Icon box name="upload" size={15} />
          Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={Object.keys(IMAGE_TYPES).join(',')}
          hidden
          onChange={(e) => {
            take(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </div>
      {error && <p className="mt-2 mb-0 text-[.8rem] text-red-400">{error}</p>}
      {previewSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewSrc}
          alt=""
          className="mt-3 block max-h-40 max-w-full rounded-md border border-dg-line-soft bg-[#1c1c1c] object-contain"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          onLoad={(e) => (e.currentTarget.style.display = '')}
        />
      )}
    </div>
  )
}
