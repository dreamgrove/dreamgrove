import WowheadIcon from './WowheadIcon'
import { qualityToColor, extractIdFromUrl } from '../../app/api/wowhead-data/utils'
import { fetchWowheadData } from 'app/api/wowhead-data/server-function'

/*This whole component is retarded because wowhead is retarded*/

export default async function Wowhead({
  id,
  name,
  type,
  disabled = false,
  noIcon = false,
  beta = false,
  url = '',
  iconSize = 16,
  showLabel = true,
  ellipsis = false,
}) {
  let display = name
  let displayId = id
  let linkColor = '#d57f43'
  let quality = -1
  let icon: React.ReactNode = null

  if (!id) {
    if (type == 'spell') {
      const spellDataModule = await import('../../spellData.json')
      const spellId = spellDataModule[name]
      if (spellId) {
        displayId = spellId
      } else {
        noIcon = true
      }
    } else {
      throw Error(`Omitting an id is possible only in a "spell" Wowhead component`)
    }
  }

  const whUrl =
    url != '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${displayId}`

  try {
    // Use the shared function directly
    console.log('Fetching icon for', type, id, name)
    const data = await fetchWowheadData({
      id: displayId,
      type,
      name,
      beta,
      url,
    })

    if (data.quality !== undefined) {
      quality = data.quality
      linkColor = qualityToColor[data.quality] || linkColor
    }

    if (!name && data.display) {
      display = data.display
    }

    icon =
      noIcon || type === 'npc' ? (
        <></>
      ) : (
        <WowheadIcon
          id={displayId}
          type={type}
          name={display}
          beta={beta}
          url={url}
          noLink={true}
          iconId={data.icon}
          iconSize={iconSize}
        />
      )
  } catch (error: any) {
    console.warn(
      `Failed to fetch from Wowhead API for ${type}=${displayId}: ${error.message || 'Unknown error'}`
    )
    // Use provided name or displayId as fallback
    display = name || `${type}-${displayId}`
  }

  return disabled ? (
    <div className={`inline decoration-2 q${quality}`} style={{ color: linkColor }}>
      {icon}
      {showLabel && (
        <span className={`text-wrap break-words ${ellipsis ? 'truncate' : ''}`}>{display}</span>
      )}
    </div>
  ) : (
    <a
      href={whUrl}
      className={`inline decoration-2 q${quality}`}
      style={{ color: linkColor, textWrap: 'nowrap' }}
    >
      {icon}
      {showLabel && (
        <span className={`text-wrap break-words ${ellipsis ? 'truncate' : ''}`}>{display}</span>
      )}
    </a>
  )
}
