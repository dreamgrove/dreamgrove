import Image from 'next/image'

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

interface WowheadIconProps {
  id: string
  type: string
  name: string
  beta?: boolean
  url?: string
  size?: number
  noLink?: boolean
  noMargin?: boolean
}

export const WowheadClientIcon = ({
  id,
  type,
  name,
  beta = false,
  url = '',
  size = 16,
  noLink = false,
  noMargin = false,
}: WowheadIconProps) => {
  const whUrl = url !== '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${id}`

  const image = (
    <span
      style={{ width: size, height: size }}
      className="my-0 mb-[-3px] mr-1 inline-block rounded bg-main"
    />
  )

  return noLink ? (
    image
  ) : (
    <a href={whUrl} className="inline">
      {image}
    </a>
  )
}
// A minimal version of the Wowhead component that doesn't require server-side rendering
export default function WowheadClientVersion({
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
  const linkColor = '#d57f43'
  const quality = 1

  if (url) {
    displayId = extractIdFromUrl(url)
  }

  const whUrl =
    url != '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${displayId}`

  if (!name) {
    if (url) {
      display = formatUrl(url)
    } else {
      display = 'name placeholder'
    }
  }

  const icon = noIcon ? null : (
    <WowheadClientIcon
      id={displayId}
      type={type}
      name={display}
      beta={beta}
      url={url}
      noLink={true}
    />
  )

  return disabled ? (
    <div className={`inline decoration-2 q${quality}`} style={{ color: linkColor }}>
      {icon}
      {showLabel && <span className="text-wrap break-words align-middle">{display}</span>}
    </div>
  ) : (
    <a
      href={whUrl}
      className={`inline decoration-2 q${quality}`}
      style={{ color: linkColor, textWrap: 'nowrap' }}
    >
      {icon}
      {showLabel && <span className="text-wrap break-words align-middle">{display}</span>}
    </a>
  )
}
