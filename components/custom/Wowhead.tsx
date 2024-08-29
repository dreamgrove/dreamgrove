import fetch from 'node-fetch'
import spellData from '../../spellData.json'

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
}) {
  let display = name
  let displayId = id
  let imageUrl = ''
  let linkColor = '#d57f43'
  let quality = -1

  if (!id) {
    if (type == 'spell') {
      const url = spellData[name]
      if (url) {
        displayId = extractIdFromUrl(url)
      } else {
        console.log(`${name} not found in local spelldata`)
      }
    } else {
      throw Error(`Omitting an id is possible only in a "spell" Wowhead component`)
    }
  }

  const whUrl = `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${displayId}`

  const res = await fetch(whUrl)
  const text = await res.text()
  const regex = new RegExp(`"${displayId}":\\{"name_enus":"[^"]+".*?,"icon":"([^"]+)"`)

  const match = regex.exec(text)

  if (match && match[1]) {
    const iconFilename = match[1]
    imageUrl = `https://wow.zamimg.com/images/wow/icons/large/${iconFilename}.jpg`
  } else {
    console.error('Icon not found for ' + displayId)
  }

  if (type == 'item') {
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

  const image =
    noIcon || imageUrl == '' ? (
      <></>
    ) : (
      <Image
        src={imageUrl}
        alt={`${display} icon`}
        width={16}
        height={16}
        className="my-0 mr-1 inline-block"
      />
    )

  return (
    <>
      {disabled ? (
        <div
          className={`inline-block decoration-2 q${quality}`}
          style={{ color: linkColor, maxWidth: '100%' }}
        >
          {image}
          <span className="whitespace-normal text-wrap break-words align-middle">{display}</span>
        </div>
      ) : (
        <a
          href={whUrl}
          className={`inline decoration-2 q${quality}`}
          style={{ color: linkColor, marginBottom: '1px', textWrap: 'nowrap' }}
        >
          {image}
          <span className="mr-1 text-balance">{display}</span>
        </a>
      )}
    </>
  )
}
