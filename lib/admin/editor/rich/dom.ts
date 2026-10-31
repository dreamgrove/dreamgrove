import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { iconGlyph, type IconName } from '@/components/Icon'

// --- Widgets -----------------------------------------------------------------

// Widgets are plain DOM, so icons are rendered to markup once and reused
const iconMarkup = new Map<string, string>()

function iconHtml(name: IconName, size?: number) {
  const key = `${name}:${size ?? ''}`
  let svg = iconMarkup.get(key)
  if (!svg) {
    svg = renderToStaticMarkup(createElement(iconGlyph(name), { size, 'aria-hidden': true }))
    iconMarkup.set(key, svg)
  }
  return svg
}

export function toggleIcon(checked: boolean, radio: boolean) {
  if (radio) return iconHtml(checked ? 'radioChecked' : 'radio', 12)
  return iconHtml(checked ? 'checkboxChecked' : 'checkbox', 12)
}

// Close and fold glyphs read heavier, so they're drawn a pixel smaller
const SMALLER: ReadonlySet<IconName> = new Set(['closeThin', 'chevronDownThin'])

export function actionButton(icon: IconName, title: string, onClick: () => void) {
  const b = document.createElement('button')
  b.type = 'button'
  b.className = 'cm-rt-btn'
  b.title = title
  b.setAttribute('aria-label', title)
  b.innerHTML = iconHtml(icon, SMALLER.has(icon) ? 12 : 13)
  b.addEventListener('mousedown', (e) => {
    e.preventDefault()
    e.stopPropagation()
  })
  b.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    onClick()
  })
  return b
}

export function el(tag: string, cls: string, text?: string) {
  const node = document.createElement(tag)
  node.className = cls
  if (text !== undefined) node.textContent = text
  return node
}

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
