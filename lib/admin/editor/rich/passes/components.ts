import type { BuildContext } from '../context'
import { formFromTag } from '../../blocks/form'
import { blockDetail, blockFields, summarizeBlock } from '../../blocks/summary'
import type { findAllTags } from '../../blocks/tags'
import { HERO_BOX, HERO_COLORS } from '../boxes'
import { BLOCK_HUES } from '../colors'
import { condHtml, setToggleNames, toggleId } from '../conditions'
import { timelineSteps } from '../spellNames'
import { spellNameById } from '@/lib/admin/spells'
import { CardWidget, type CardSpec } from '../widgets/CardWidget'
import { INLINE_COMPONENTS } from '../marks'

/** MDX components: block cards, inline chips and the boxes around wrapper sections. */
export function components(ctx: BuildContext, tags: ReturnType<typeof findAllTags>) {
  const {
    text,
    h,
    folds,
    covered,
    code,
    boxes,
    wrapper,
    blocked,
    replace,
    widget,
    lineSpan,
    blockSpan,
  } = ctx
  const toggleNames = new Map<string, string>()
  for (const tag of tags) {
    if (tag.block.id !== 'checkbox') continue
    const { values } = formFromTag(tag)
    const name =
      String(values.name ?? '').trim() || spellNameById(String(values.spellId ?? '').trim())
    const id = toggleId(tag)
    if (id && name && !toggleNames.has(id)) toggleNames.set(id, name)
  }
  setToggleNames(toggleNames)
  for (const tag of tags) {
    if (blocked(tag.from, tag.to)) continue
    const { block } = tag
    const { values } = formFromTag(tag)
    const str = (k: string) => String(values[k] ?? '').trim()
    const summary =
      block.id === 'checkbox'
        ? summarizeBlock(tag) || spellNameById(str('spellId')) || ''
        : summarizeBlock(tag)
    const thumb =
      block.id === 'youtube' && str('id')
        ? `https://i.ytimg.com/vi/${str('id')}/default.jpg`
        : undefined
    const span = INLINE_COMPONENTS.has(block.id) ? null : blockSpan(tag.from, tag.to)
    const foldable = !tag.selfClosing && block.id !== 'talents'
    const description = block.id === 'talents' ? str('comment') : undefined
    const hero = block.id === 'hero' ? (HERO_COLORS[str('id')] ? str('id') : 'generic') : undefined
    // <Talents>…</Talents>: the content renders under the tree as an extra
    const bodyLabel =
      !tag.selfClosing && block.fields.some((f) => f.body) ? 'Optional body' : undefined
    const fields = tag.selfClosing || bodyLabel ? blockFields(tag) : []
    const spells = block.id === 'timeline' ? timelineSteps(values.spellIds as string[]) : undefined
    const cond = span?.cond
    const spec = (kind: CardSpec['kind'], from: number): CardSpec => ({
      kind,
      label: block.label,
      summary,
      detail: blockDetail(tag),
      tagOffset: tag.from - from,
      editable: true,
      thumb,
      foldable,
      description: kind === 'footer' ? undefined : description,
      linkId: block.id === 'checkbox' ? toggleId(tag) : undefined,
      hue: hero ? HERO_COLORS[hero] : BLOCK_HUES[block.id],
      tint: !!hero,
      chipType:
        block.id === 'wowhead'
          ? (str('type') || 'spell').replace(/^./, (c) => c.toUpperCase())
          : undefined,
      toggle:
        block.id === 'checkbox'
          ? { checked: !!values.defaultCheck, radio: str('radio') }
          : undefined,
      fields:
        (kind === 'card' || bodyLabel) && kind !== 'footer' && fields.length ? fields : undefined,
      bodyLabel: kind === 'header' ? bodyLabel : undefined,
      spells: kind === 'card' ? spells : undefined,
      cond:
        cond && kind !== 'footer' ? { expr: cond, html: condHtml(cond), lead: true } : undefined,
      href:
        block.id === 'planner' && str('code')
          ? {
              url: `/planner?loadout=${encodeURIComponent(str('code'))}`,
              title: 'Open in the planner',
            }
          : undefined,
    })
    const closeSpan = tag.close && lineSpan(tag.close.from, tag.close.to)
    if (span && closeSpan && foldable && folds.includes(tag.from)) {
      // Folded: the header stands in for the whole section
      const raw = text.slice(span.from, closeSpan.to)
      widget(
        span.from,
        closeSpan.to,
        new CardWidget(raw, { ...spec('header', span.from), folded: true }, h),
        true
      )
      covered.push([span.from, closeSpan.to])
      continue
    }
    if (span) {
      const kind = tag.selfClosing ? 'card' : 'header'
      widget(
        span.from,
        span.to,
        new CardWidget(text.slice(span.from, span.to), spec(kind, span.from), h),
        true
      )
      covered.push([span.from, span.to])
    } else {
      widget(
        tag.from,
        tag.to,
        new CardWidget(text.slice(tag.from, tag.to), spec('chip', tag.from), h)
      )
      covered.push([tag.from, tag.to])
    }
    if (tag.close) {
      const { from, to } = tag.close
      if (closeSpan) {
        const raw = text.slice(closeSpan.from, closeSpan.to)
        widget(
          closeSpan.from,
          closeSpan.to,
          new CardWidget(raw, spec('footer', closeSpan.from), h),
          true
        )
        covered.push([closeSpan.from, closeSpan.to])
        if (span && !tag.selfClosing) {
          boxes.push({ a: span.to, b: closeSpan.from, kind: hero ? HERO_BOX[hero] : 's' })
          wrapper(span.from, closeSpan.from, closeSpan.to)
        }
      } else {
        replace(from, to)
        covered.push([from, to])
      }
    }
  }
}
