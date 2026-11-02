import { useEffect, useState, memo } from 'react'
import WowheadClientIcon from './WowheadClientIcon'
import { getWowheadInfo } from '@/lib/wowhead/client'
import { extractIdFromUrl, buildWowheadUrl, qualityToColor } from '@/lib/wowhead/urls'
import { spellIdFromName } from '@/lib/wowhead/spellIds'

const DEFAULT_LINK_COLOR = '#d57f43'

// The admin preview's stand-in for the server-rendered Wowhead component: same
// props and id resolution, but the tooltip data is fetched in the browser.
function WowheadClientVersion({
  id,
  name,
  type,
  disabled = false,
  noIcon = false,
  beta = false,
  url = '',
  iconSize = 16,
  showLabel = true,
}) {
  // Without an id, resolve a spell from its name so `!SpellName!` still shows a
  // real icon, falling back to the id in an explicit url.
  let displayId = id
  if (!id && type === 'spell') {
    displayId = spellIdFromName(name) ?? (url ? extractIdFromUrl(url) : '')
  }

  const whUrl = url !== '' ? url : buildWowheadUrl(type, displayId, name, beta)

  // The answer for the last request; loading until it matches the current one
  const request = `${type}|${displayId}|${name}|${beta}|${url}`
  const canFetch = !!displayId || !!url
  const [fetched, setFetched] = useState<{
    request: string
    display?: string
    quality?: number
  } | null>(null)
  const isLoading = canFetch && fetched?.request !== request

  useEffect(() => {
    if (!canFetch) return
    let cancelled = false
    getWowheadInfo({ id: displayId || '', type, name: name || '', beta, url })
      .then((data) => {
        if (!cancelled) setFetched({ request, display: data.display, quality: data.quality })
      })
      .catch((error) => {
        console.warn(`Failed to fetch from Wowhead for ${type}=${displayId}: ${error.message}`)
        if (!cancelled) setFetched({ request, display: name || `${type}-${displayId}` })
      })
    return () => {
      cancelled = true
    }
  }, [canFetch, request, displayId, type, name, beta, url])

  const display = name || fetched?.display || ''
  const quality = fetched?.quality ?? -1
  const linkColor =
    (fetched?.quality !== undefined && qualityToColor[fetched.quality]) || DEFAULT_LINK_COLOR

  const icon = noIcon ? null : (
    <span className="wowhead-icon-wrap">
      <WowheadClientIcon
        id={displayId}
        type={type}
        name={display}
        beta={beta}
        url={url}
        noLink={true}
        iconSize={iconSize}
      />
    </span>
  )

  const label = showLabel && (
    <span className="align-middle text-wrap break-words">
      {isLoading ? '(loading...)' : display}
    </span>
  )

  return disabled ? (
    <span
      className={`inline-flex items-baseline gap-1 decoration-2 q${quality}`}
      style={{ color: linkColor }}
    >
      {icon}
      {label}
    </span>
  ) : (
    <a
      href={whUrl}
      className={`inline-flex items-baseline gap-1 decoration-2 q${quality}`}
      style={{ color: linkColor, textWrap: 'nowrap' }}
    >
      {type != 'npc' && icon}
      {label}
    </a>
  )
}

export default memo(WowheadClientVersion, (prevProps, nextProps) => {
  // name participates: the href host (ko vs www) and the displayed label both
  // derive from it, so a label edit in the admin preview must re-render.
  return prevProps.id === nextProps.id && prevProps.name === nextProps.name
})
