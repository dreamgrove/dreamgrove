interface Rect {
  x: number
  y: number
  w: number
  h: number
}

interface CardState {
  id: string
  card: Rect
  art: Rect
}

const EASING = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

const toRect = (r: DOMRect): Rect => ({ x: r.left, y: r.top, w: r.width, h: r.height })

function measure(card: HTMLElement): CardState | null {
  const img = card.querySelector('img')
  if (!img || !img.naturalWidth) return null
  // The img box includes any hover zoom; the art fills it with object-fit: cover
  const box = toRect(img.getBoundingClientRect())
  const [px, py] = getComputedStyle(img)
    .objectPosition.split(' ')
    .map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5))
  const scale = Math.max(box.w / img.naturalWidth, box.h / img.naturalHeight)
  const w = img.naturalWidth * scale
  const h = img.naturalHeight * scale
  return {
    id: card.dataset.specCard!,
    card: toRect(card.getBoundingClientRect()),
    art: { x: box.x + (box.w - w) * px, y: box.y + (box.h - h) * py, w, h },
  }
}

/** Where `card` sits in art `from`'s frame, carried over to art `to`, relative to `origin` */
function carry(card: Rect, from: Rect, to: Rect, origin: Rect) {
  const k = to.w / from.w
  return {
    width: `${card.w * k}px`,
    height: `${card.h * k}px`,
    transform: `translate(${to.x + (card.x - from.x) * k - origin.x}px, ${
      to.y + (card.y - from.y) * k - origin.y
    }px)`,
  }
}

const at = (r: Rect) => ({ width: `${r.w}px`, height: `${r.h}px`, transform: 'translate(0, 0)' })

async function morph(from: CardState) {
  const group = `::view-transition-group(spec-card-${from.id})`
  // Wait for the transition's pseudo-elements
  let groupAnim: Animation | undefined
  for (let i = 0; i < 120 && !groupAnim; i++) {
    await new Promise((r) => requestAnimationFrame(r))
    groupAnim = document
      .getAnimations()
      .find((a) => (a.effect as KeyframeEffect | null)?.pseudoElement === group)
  }
  const card = document.querySelector<HTMLElement>(`[data-spec-card="${from.id}"]`)
  if (!groupAnim || !card) return
  const to = measure(card)
  if (!to) return

  const duration = Number(groupAnim.effect?.getComputedTiming().duration) || 600
  const opts = (pseudoElement: string) => ({
    pseudoElement,
    duration,
    easing: EASING,
    fill: 'backwards' as const,
  })
  const root = document.documentElement
  const anims = [
    root.animate(
      [carry(to.card, to.art, from.art, from.card), at(to.card)],
      opts(`::view-transition-new(spec-card-${from.id})`)
    ),
    root.animate(
      [at(from.card), carry(from.card, from.art, to.art, to.card)],
      opts(`::view-transition-old(spec-card-${from.id})`)
    ),
  ]

  const leavingTile = from.card.h < to.card.h
  const [tile, hero] = leavingTile ? ['old', 'new'] : ['new', 'old']
  const swap = Math.min(150 / duration, 1)
  const fade = (pseudo: string, start: number, zIndex: number) =>
    root.animate(
      [
        { opacity: start, zIndex, offset: 0 },
        { opacity: 1 - start, zIndex, offset: swap },
        { opacity: 1 - start, zIndex, offset: 1 },
      ],
      { ...opts(`::view-transition-${pseudo}(spec-card-${from.id})`), easing: 'linear' }
    )
  anims.push(fade(tile, leavingTile ? 1 : 0, 2), fade(hero, leavingTile ? 0 : 1, 1))
  // Sync with the browser's morph once it has actually started: its startTime is null while
  // pending, and assigning null would pause these, so the transition would never finish
  try {
    await groupAnim.ready
  } catch {
    return
  }
  const start = groupAnim.startTime
  if (start !== null) anims.forEach((a) => (a.startTime = start))
}

export function inPageTransition() {
  return document
    .getAnimations()
    .some((a) =>
      (a.effect as KeyframeEffect | null)?.pseudoElement?.startsWith('::view-transition')
    )
}

if (typeof document !== 'undefined' && 'startViewTransition' in document) {
  document.addEventListener(
    'click',
    (e) => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const link = (e.target as Element | null)?.closest?.('a[href]')
      if (!link) return
      const cards = document.querySelectorAll<HTMLElement>('[data-spec-card]')
      const card =
        link.closest<HTMLElement>('[data-spec-card]') ?? (cards.length === 1 ? cards[0] : null)
      const state = card && measure(card)
      if (state) morph(state)
    },
    true
  )
}
