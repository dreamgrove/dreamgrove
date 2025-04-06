/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import { fetchWowheadData } from '../../../app/api/wowhead-data/utils'

export default async function BossCard({ title, image, id, children }) {
  let imageUrl = ''

  if (image) {
    imageUrl = `/static/images/${image}`
  } else if (id) {
    try {
      const data = await fetchWowheadData({
        id,
        type: 'npc',
        beta: true,
      })

      if (data.icon) {
        imageUrl = `https://wow.zamimg.com/images/wow/icons/large/${data.icon}.jpg`
      }
    } catch (error) {
      console.error('Error fetching boss image:', error)
      // Continue without an image
    }
  }

  return (
    <div className={`mb-16 mt-4 ${!children || children.length === 0 ? 'hidden' : ''}`}>
      <div className="items-bottom flex min-h-[64px]">
        {imageUrl !== '' && (
          <div className="mr-2 flex h-[50px] w-[50px] justify-center overflow-hidden rounded-md border-4 border-[#524C42] align-middle">
            <img src={imageUrl} alt="Image" className="my-0 h-full w-auto object-cover" />
          </div>
        )}
        <h2
          className={`bossTitle mb-4 flex-grow self-center border-b-4 border-main pb-2 text-3xl font-semibold text-white`}
        >
          {title}
        </h2>
      </div>
      <div className="w-full px-1 py-2 md:px-4 [&>div]:list-none">{children}</div>
    </div>
  )
}
