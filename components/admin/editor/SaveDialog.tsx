'use client'

import { useState } from 'react'
import Dialog from '@/components/admin/ui/Dialog'
import Icon from '@/components/Icon'
import { BTN_GHOST, BTN_PRIMARY, INPUT, LABEL, TEXTAREA } from '@/components/admin/ui/styles'

export default function SaveDialog({
  filePath,
  isNewFile,
  viaFork,
  defaultTitle,
  saving,
  onConfirm,
  onClose,
}: {
  filePath: string
  isNewFile: boolean
  /** The user has no write access, so the PR is opened from their fork */
  viaFork: boolean
  defaultTitle: string
  saving: boolean
  onConfirm: (title: string, message: string) => void
  onClose: () => void
}) {
  const [step, setStep] = useState<'compose' | 'confirm'>('compose')
  const [title, setTitle] = useState(defaultTitle)
  const [message, setMessage] = useState('')
  const next = () => title.trim() && setStep('confirm')

  if (step === 'compose') {
    return (
      <Dialog
        title="Save changes"
        subtitle="Your edits are submitted as a pull request for review."
        onClose={onClose}
        footer={
          <>
            <button type="button" onClick={onClose} className={BTN_GHOST}>
              Cancel
            </button>
            <button type="button" onClick={next} disabled={!title.trim()} className={BTN_PRIMARY}>
              Continue
            </button>
          </>
        }
      >
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            next()
          }}
        >
          <div>
            <label htmlFor="commit-title" className={LABEL}>
              Title<span className="ml-0.5 text-main">*</span>
            </label>
            <input
              id="commit-title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={INPUT}
              placeholder="Brief description of changes"
              required
            />
          </div>
          <div>
            <label htmlFor="commit-message" className={LABEL}>
              Description <span className="font-normal text-white/35">(optional)</span>
            </label>
            <textarea
              id="commit-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={TEXTAREA}
              placeholder="A more detailed explanation of changes"
              rows={4}
            />
          </div>
        </form>
      </Dialog>
    )
  }

  return (
    <Dialog
      title="Create pull request?"
      onClose={onClose}
      dismissable={!saving}
      footer={
        <>
          <button
            type="button"
            onClick={() => setStep('compose')}
            disabled={saving}
            className={BTN_GHOST}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => onConfirm(title, message)}
            disabled={saving}
            className={BTN_PRIMARY}
          >
            {saving ? 'Creating PR…' : 'Create PR'}
          </button>
        </>
      }
    >
      <dl className="m-0 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 text-[.9rem]">
        <dt className="text-white/45">File</dt>
        <dd className="m-0 font-mono text-[.82rem] break-all text-white/80">
          {filePath}
          {isNewFile && <span className="ml-2 font-sans text-dg-highlight">(new)</span>}
        </dd>
        <dt className="text-white/45">Title</dt>
        <dd className="m-0 text-white">{title}</dd>
        {message && (
          <>
            <dt className="text-white/45">Description</dt>
            <dd className="m-0 whitespace-pre-wrap text-white/80">{message}</dd>
          </>
        )}
      </dl>
      <p className="mt-5 mb-0 text-[.85rem] text-white/50">
        {viaFork
          ? 'You don’t have write access to dreamgrove, so this will fork it to your GitHub account and open a pull request from there for a maintainer to review.'
          : 'This will create a pull request with your changes. Are you sure you want to proceed?'}
      </p>
    </Dialog>
  )
}

export function PullRequestCreated({ url }: { url: string }) {
  return (
    <Dialog title="Pull request created" onClose={() => {}} dismissable={false} width="max-w-md">
      <p className="m-0 text-[.92rem] leading-relaxed text-white/70">
        Your changes have been submitted as a pull request. You’ll be redirected to GitHub in a
        moment.
      </p>
      <a href={url} target="_blank" rel="noopener noreferrer" className={`${BTN_PRIMARY} mt-5`}>
        View pull request
        <Icon box name="external" size={14} />
      </a>
    </Dialog>
  )
}
