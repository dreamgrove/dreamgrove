import fetch from 'node-fetch'
import spellData from '../../spellData.json'
import WowheadIcon from './WowheadIcon'

function formatUrl(url) {
  const parts = url.split('/')
  const lastPart = parts.pop()
  const formatted = lastPart
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  return formatted
}

function extractIdFromUrl(url) {
  const parts = url.split('/')
  const lastPart = parts[parts.length - 1]
  const id = lastPart.split('-')[0]
  return id
}

const qualityToColor = {
  1: '#ffffff',
  2: '#1eff00',
  3: '#0070dd',
  4: '#a335ee',
  5: '#ff8000',
}

/*This whole component is retarded because wowhead is retarded*/

export default async function Wowhead({
  id,
  name,
  type,
  disabled = false,
  noIcon = false,
  beta = false,
  url = '',
  showLabel = true,
}) {
  let display = name
  let displayId = id
  let linkColor = '#d57f43'
  let quality = -1

  if (!id) {
    if (type == 'spell') {
      const url = spellData[name]
      if (url) {
        displayId = extractIdFromUrl(url)
      }
    } else {
      throw Error(`Omitting an id is possible only in a "spell" Wowhead component`)
    }
  }

  const whUrl =
    url != '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${displayId}`

  const res = await fetch(whUrl)

  if (type == 'item') {
    const text = await res.text()
    const qualityRegex = /<b class=\\"q(\d+)\\">/
    const qualityMatch = text.match(qualityRegex)

    if (qualityMatch && qualityMatch[1]) {
      linkColor = qualityToColor[qualityMatch[1]]
      quality = qualityMatch[1]
    }
  }

  if (!name) {
    display = formatUrl(res.url)
  }

  const icon = noIcon ? null : (
    <WowheadIcon id={displayId} type={type} name={display} beta={beta} url={url} noLink={true} />
  )

  return disabled ? (
    <div className={`inline decoration-2 q${quality}`} style={{ color: linkColor }}>
      {icon}
      {showLabel && <span className="text-wrap break-words">{display}</span>}
    </div>
  ) : (
    <a
      href={whUrl}
      className={`inline decoration-2 q${quality}`}
      style={{ color: linkColor, textWrap: 'nowrap' }}
    >
      {icon}
      {showLabel && <span className="text-wrap break-words">{display}</span>}
    </a>
  )
}
