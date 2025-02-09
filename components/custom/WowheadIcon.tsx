import Image from 'next/image'
import fetch from 'node-fetch'

interface WowheadIconProps {
  id: string
  type: string
  name: string
  beta?: boolean
  url?: string
  size?: number
  noLink?: boolean
}

export default async function WowheadIcon({
  id,
  type,
  name,
  beta = false,
  url = '',
  size = 16,
  noLink = false,
}: WowheadIconProps) {
  const whUrl = url !== '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${id}`

  try {
    const res = await fetch(whUrl)
    const text = await res.text()
    const regex = new RegExp(`"${id}":\\{"name_enus":"[^"]+".*?,"icon":"([^"]+)"`)
    const match = regex.exec(text)

    if (match && match[1]) {
      const iconFilename = match[1]
      const imageUrl = `https://wow.zamimg.com/images/wow/icons/large/${iconFilename}.jpg`

      const image = (
        <Image
          src={imageUrl}
          alt={`${name} icon`}
          width={size}
          height={size}
          className="my-0 mr-1 inline-block"
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
  } catch (error) {
    console.error('Error fetching icon for ' + id, error)
  }

  return null
}
