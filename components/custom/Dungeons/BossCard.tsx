/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import UwU from './UwU'
export default async function BossCard({ title, image, id, children }) {
  const whUrl = `https://www.wowhead.com/beta/npc=${id}`

  const res = await fetch(whUrl)
  const text = await res.text()
  const imgRegex = new RegExp(`<th><div class="infobox-portrait"><img src="([^"]+)" alt="([^"]+)">`)
  let imageUrl = ''

  const match = imgRegex.exec(text)

  if (match && match[1]) {
    imageUrl = match[1]
  } else {
    if (id) console.log('Icon not found for ' + id)
  }

  if (image) imageUrl = `/static/images/${image}`

  return (
    <div className={`mb-16 mt-4 ${!children || children.length === 0 ? 'hidden' : ''}`}>
      <div className="items-bottom flex min-h-[64px] ">
        {imageUrl != '' && (
          <div className="mr-2 flex h-[50px] w-[50px] justify-center overflow-hidden rounded-md border-4 border-[#524C42] align-middle">
            <img src={imageUrl} alt="Image" className=" my-0 h-full w-auto object-cover" />
          </div>
        )}
        <div
          className={`bossTitle mb-4 flex-grow self-center border-b-4 border-main pb-2 text-3xl font-semibold text-white`}
        >
          {title}
        </div>
      </div>
      <div className="w-full px-1 py-2 md:px-4 [&>div]:list-none">
        <UwU>{children}</UwU>
      </div>
    </div>
  )
}
