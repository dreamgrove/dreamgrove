'use client'

import { useEffect, type ReactNode } from 'react'
import Icon from '@/components/Icon'

export default function Dialog({
  title,
  subtitle,
  eyebrow,
  onClose,
  children,
  footer,
  width = 'max-w-xl',
  height = '',
  bodyClassName = 'px-[22px] pt-5 pb-6',
  dismissable = true,
}: {
  title: ReactNode
  subtitle?: ReactNode
  /** Small breadcrumb line above the title */
  eyebrow?: ReactNode
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  width?: string
  /** Fixed height class, so the dialog doesn't jump around */
  height?: string
  bodyClassName?: string
  dismissable?: boolean
}) {
  useEffect(() => {
    if (!dismissable) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, dismissable])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 sm:items-center"
      onMouseDown={(e) => dismissable && e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`flex max-h-[calc(100dvh-5rem)] w-full ${width} ${height} flex-col overflow-hidden rounded-lg border border-dg-line-soft bg-[#232323] text-[#f5f5f5] shadow-[0_20px_60px_rgba(0,0,0,.5)]`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-dg-line-soft px-[22px] pt-4 pb-[18px]">
          <div className="flex min-w-0 flex-col gap-1">
            {eyebrow && (
              <div className="flex items-center gap-1.5 text-[.75rem] text-[#8a8a8a]">
                {eyebrow}
              </div>
            )}
            <h2 className="m-0 text-[1.25rem] font-bold text-white">{title}</h2>
            {subtitle && <p className="m-0 text-[.875rem] text-[#a3a3a3]">{subtitle}</p>}
          </div>
          {dismissable && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mt-0.5 -mr-2 rounded-md p-2 text-[#8a8a8a] transition-colors hover:bg-[#2e2e2e] hover:text-white"
            >
              <Icon box name="close" size={16} />
            </button>
          )}
        </div>
        <div className={`min-h-0 flex-1 overflow-y-auto ${bodyClassName}`}>{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-dg-line-soft px-[22px] py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
