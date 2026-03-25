'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTimelineContext } from './TimelineProvider/useTimelineContext'
import { useLoadouts, Loadout } from 'hooks/useLoadouts'
import { encodeLoadout, decodeLoadout } from '@/lib/utils/loadoutCode'
import { PlayerAction } from '@/types/timeline'

export default function LoadoutManager() {
  const {
    inputEvents,
    setInputEvents,
    currentSpec,
    setCurrentSpec,
    activeTalents,
    setActiveTalents,
    localSpells,
    createCustomSpell,
    getSpellsForSpec,
  } = useTimelineContext()

  const { loadouts, saveLoadout, deleteLoadout, renameLoadout } = useLoadouts()

  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importCode, setImportCode] = useState('')
  const [importError, setImportError] = useState('')
  const [exportCopied, setExportCopied] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const saveInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setIsSaving(false)
        setIsImporting(false)
        setImportCode('')
        setImportError('')
        setEditingId(null)
        setConfirmDeleteId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus save input when opening save mode
  useEffect(() => {
    if (isSaving) saveInputRef.current?.focus()
  }, [isSaving])

  useEffect(() => {
    if (editingId) editInputRef.current?.focus()
  }, [editingId])

  const handleSave = () => {
    const name = saveName.trim()
    if (!name) return
    saveLoadout(name, currentSpec, inputEvents, activeTalents)
    setSaveName('')
    setIsSaving(false)
  }

  const handleLoad = (loadout: Loadout) => {
    // Set spec first — the useEffect in useActiveBindings will reset talents & inputs,
    // so we defer restoring those to the next tick
    if (loadout.spec !== currentSpec) {
      setCurrentSpec(loadout.spec)
      // Wait for the spec-change effect to fire, then overwrite
      setTimeout(() => {
        setInputEvents(loadout.inputEvents)
        setActiveTalents(loadout.activeTalents)
      }, 0)
    } else {
      setInputEvents(loadout.inputEvents)
      setActiveTalents(loadout.activeTalents)
    }
    setIsOpen(false)
  }

  const handleRename = (id: string) => {
    const name = editName.trim()
    if (!name) return
    renameLoadout(id, name)
    setEditingId(null)
    setEditName('')
  }

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      deleteLoadout(id)
      setConfirmDeleteId(null)
    } else {
      setConfirmDeleteId(id)
    }
  }

  // Focus import input
  useEffect(() => {
    if (isImporting) importInputRef.current?.focus()
  }, [isImporting])

  const handleExport = () => {
    try {
      const code = encodeLoadout(currentSpec, activeTalents, inputEvents)
      navigator.clipboard.writeText(code)
      setExportCopied(true)
      setTimeout(() => setExportCopied(false), 2000)
    } catch {
      // Silently fail
    }
  }

  const handleImport = () => {
    const code = importCode.trim()
    if (!code) return
    setImportError('')

    try {
      const decoded = decodeLoadout(code)

      // Build a spell lookup from all known spells + decoded custom spells
      const allSpells = [...localSpells, ...decoded.customSpells]
      const spellMap = new Map(allSpells.map((s) => [s.spellId, s]))

      // Reconstruct PlayerAction array
      const events: PlayerAction[] = []
      for (const e of decoded.events) {
        const spell = spellMap.get(e.spellId)
        if (!spell) continue // Skip unknown spells
        events.push({
          spell,
          instant: e.instant,
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        })
      }

      // Register custom spells so processEventQueue can find them
      const hasNewCustomSpells = decoded.customSpells.some(
        (cs) => !localSpells.some((s) => s.spellId === cs.spellId)
      )
      for (const cs of decoded.customSpells) {
        if (!localSpells.some((s) => s.spellId === cs.spellId)) {
          createCustomSpell(cs)
        }
      }

      // Apply the loadout — defer to next tick so custom spell state updates
      // have flushed before processEventQueue runs
      const applyLoadout = () => {
        setInputEvents(events)
        setActiveTalents(decoded.activeTalents)
      }

      if (decoded.spec !== currentSpec) {
        setCurrentSpec(decoded.spec)
      }

      if (decoded.spec !== currentSpec || hasNewCustomSpells) {
        setTimeout(applyLoadout, 0)
      } else {
        applyLoadout()
      }

      setIsImporting(false)
      setImportCode('')
      setIsOpen(false)
    } catch {
      setImportError('Invalid code')
    }
  }

  const specLabels: Record<string, string> = {
    balance: 'Bal',
    resto: 'Resto',
    feral: 'Feral',
    guardian: 'Guard',
    all: 'All',
  }

  const specColors: Record<string, string> = {
    balance: 'text-blue-300',
    resto: 'text-green-300',
    feral: 'text-yellow-300',
    guardian: 'text-amber-400',
    all: 'text-neutral-300',
  }

  return (
    <div ref={panelRef} className="relative">
      {/* Toggle button */}
      <button
        onClick={() => {
          setIsOpen((p) => !p)
          setIsSaving(false)
          setIsImporting(false)
          setImportCode('')
          setImportError('')
          setEditingId(null)
          setConfirmDeleteId(null)
        }}
        className={`flex items-center gap-1.5 rounded-sm border px-3 py-[5px] text-sm font-medium transition-colors duration-200 ${
          isOpen
            ? 'border-orange-500/50 bg-orange-500/20 text-orange-300'
            : 'border-neutral-600/50 bg-neutral-900/40 text-neutral-300 hover:border-neutral-500/50 hover:bg-neutral-700/70 hover:text-white'
        }`}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path
            d="M2 2h8l4 4v8a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1zm7 0v4h4M4 10h8M4 13h5"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        Loadouts
        {loadouts.length > 0 && (
          <span className="ml-0.5 rounded-full bg-neutral-700/80 px-1.5 text-[0.65rem] text-neutral-400">
            {loadouts.length}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-1.5 w-72 rounded border border-neutral-600/60 bg-neutral-900/98 shadow-xl shadow-black/40 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-700/50 px-3 py-2">
            <span className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
              Saved Loadouts
            </span>
            <div className="flex items-center gap-1.5">
              {/* Import */}
              <button
                onClick={() => {
                  setIsImporting(true)
                  setIsSaving(false)
                  setEditingId(null)
                  setConfirmDeleteId(null)
                }}
                title="Import"
                className="rounded-sm p-1 text-neutral-500 transition-colors hover:bg-neutral-700/50 hover:text-neutral-300"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 2v8M5 7l3 3 3-3M3 12h10" />
                </svg>
              </button>
              {/* Export */}
              <button
                onClick={handleExport}
                title={exportCopied ? 'Copied!' : 'Export to clipboard'}
                className={`rounded-sm p-1 transition-colors ${
                  exportCopied
                    ? 'text-green-400'
                    : 'text-neutral-500 hover:bg-neutral-700/50 hover:text-neutral-300'
                }`}
              >
                {exportCopied ? (
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8.5l3 3 7-7" />
                  </svg>
                ) : (
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 14V6M5 9l3-3 3 3M3 4h10" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => {
                  setIsSaving(true)
                  setIsImporting(false)
                  setEditingId(null)
                  setConfirmDeleteId(null)
                }}
                className="rounded-sm bg-orange-500/20 px-2 py-0.5 text-xs font-medium text-orange-300 transition-colors hover:bg-orange-500/30 hover:text-orange-200"
              >
                + Save Current
              </button>
            </div>
          </div>

          {/* Import input */}
          {isImporting && (
            <div className="border-b border-neutral-700/50 px-3 py-2">
              <div className="flex gap-1.5">
                <input
                  ref={importInputRef}
                  type="text"
                  value={importCode}
                  onChange={(e) => {
                    setImportCode(e.target.value)
                    setImportError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleImport()
                    if (e.key === 'Escape') {
                      setIsImporting(false)
                      setImportCode('')
                      setImportError('')
                    }
                  }}
                  placeholder="Paste loadout code..."
                  className="flex-1 rounded-sm border border-neutral-600/50 bg-neutral-800/80 px-2 py-1 text-xs text-white placeholder-neutral-500 focus:border-orange-500/50 focus:outline-none"
                />
                <button
                  onClick={handleImport}
                  disabled={!importCode.trim()}
                  className="rounded-sm bg-orange-500/30 px-2.5 py-1 text-xs font-medium text-orange-300 transition-colors hover:bg-orange-500/40 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Load
                </button>
              </div>
              {importError && <p className="mt-1 text-[0.6rem] text-red-400">{importError}</p>}
              <p className="mt-1 text-[0.6rem] text-neutral-500">
                Paste a code from someone else to load their setup
              </p>
            </div>
          )}

          {/* Save input */}
          {isSaving && (
            <div className="border-b border-neutral-700/50 px-3 py-2">
              <div className="flex gap-1.5">
                <input
                  ref={saveInputRef}
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave()
                    if (e.key === 'Escape') setIsSaving(false)
                  }}
                  placeholder="Loadout name..."
                  maxLength={40}
                  className="flex-1 rounded-sm border border-neutral-600/50 bg-neutral-800/80 px-2 py-1 text-xs text-white placeholder-neutral-500 focus:border-orange-500/50 focus:outline-none"
                />
                <button
                  onClick={handleSave}
                  disabled={!saveName.trim()}
                  className="rounded-sm bg-orange-500/30 px-2.5 py-1 text-xs font-medium text-orange-300 transition-colors hover:bg-orange-500/40 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save
                </button>
              </div>
              <p className="mt-1 text-[0.6rem] text-neutral-500">
                Saves current spec, talents, and timeline
              </p>
            </div>
          )}

          {/* Loadout list */}
          <div className="max-h-64 overflow-y-auto">
            {loadouts.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-neutral-500">
                No saved loadouts yet.
                <br />
                <span className="text-neutral-600">
                  Click &quot;Save Current&quot; to save your timeline.
                </span>
              </div>
            ) : (
              loadouts.map((loadout) => (
                <div
                  key={loadout.id}
                  className="group border-b border-neutral-800/60 px-3 py-2 transition-colors last:border-b-0 hover:bg-neutral-800/40"
                >
                  {editingId === loadout.id ? (
                    // Rename mode
                    <div className="flex gap-1.5">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(loadout.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        maxLength={40}
                        className="flex-1 rounded-sm border border-neutral-600/50 bg-neutral-800/80 px-2 py-0.5 text-xs text-white focus:border-orange-500/50 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRename(loadout.id)}
                        className="text-xs text-orange-400 hover:text-orange-300"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Main row */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleLoad(loadout)}
                          className="flex min-w-0 flex-1 items-center gap-2 text-left"
                        >
                          <span className="truncate text-xs font-medium text-neutral-200 transition-colors group-hover:text-white">
                            {loadout.name}
                          </span>
                          <span
                            className={`shrink-0 text-[0.6rem] font-medium ${specColors[loadout.spec] || 'text-neutral-400'}`}
                          >
                            {specLabels[loadout.spec] || loadout.spec}
                          </span>
                        </button>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => {
                              setEditingId(loadout.id)
                              setEditName(loadout.name)
                              setConfirmDeleteId(null)
                            }}
                            title="Rename"
                            className="rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-700/50 hover:text-neutral-300"
                          >
                            <svg
                              className="h-3 w-3"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            >
                              <path d="M11 2l3 3-9 9H2v-3z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(loadout.id)}
                            title={
                              confirmDeleteId === loadout.id ? 'Click again to confirm' : 'Delete'
                            }
                            className={`rounded p-1 transition-colors ${
                              confirmDeleteId === loadout.id
                                ? 'bg-red-500/20 text-red-400'
                                : 'text-neutral-500 hover:bg-neutral-700/50 hover:text-red-400'
                            }`}
                          >
                            <svg
                              className="h-3 w-3"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            >
                              <path d="M4 4l8 8M12 4l-8 8" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Meta line */}
                      <div className="mt-0.5 flex items-center gap-2 text-[0.6rem] text-neutral-500">
                        <span>
                          {loadout.inputEvents.length} cast
                          {loadout.inputEvents.length !== 1 ? 's' : ''}
                        </span>
                        <span className="text-neutral-700">&middot;</span>
                        <span>
                          {loadout.activeTalents.length} talent
                          {loadout.activeTalents.length !== 1 ? 's' : ''}
                        </span>
                        <span className="text-neutral-700">&middot;</span>
                        <span>{formatDate(loadout.createdAt)}</span>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
