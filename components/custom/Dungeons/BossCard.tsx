/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
// 213179
export default async function BossCard({ title, image, id, children }) {
  const whUrl = `https://www.wowhead.com/beta/npc=${id}`

  const res = await fetch(whUrl)
  const text = await res.text()
  const imgRegex = new RegExp(`<th><div class="infobox-portrait"><img src="([^"]+)" alt="([^"]+)">`)
  let imageUrl = ''

  const match = imgRegex.exec(text)

  if (match && match[1]) {
    imageUrl = match[1]
    console.log(imageUrl)
    console.log(match[2])
  } else {
    //throw Error('Icon not found for ' + id)
  }
  return (
    <div className="relative my-4 min-h-[130px] rounded-lg bg-white shadow-md">
      <div className="absolute -left-4 -top-4">
        <img
          src={imageUrl || ''}
          alt="Image"
          className="h-16 w-16 rounded-full border-4 border-white"
        />
      </div>
      <div className=" w-full">
        <h2 className="text-xl font-semibold">Card Title</h2>
        <p className="text-gray-600">
          This is a card description. It has some text to fill the content of the card.
        </p>
      </div>
    </div>
  )

  return (
    <div
      className={`mb-6 flex w-full rounded-lg border border-gray-900/30 bg-gray-900/30 shadow-lg ${children.length == 0 ? 'hidden' : ''}`}
    >
      <div className="relative w-1/4">
        <Image
          src={`/static/images/dungeons/${image}`}
          layout="fill"
          alt="Image"
          className="my-0 h-full w-full rounded-l-lg object-cover object-top"
        />
      </div>
      <div className="flex w-3/4 flex-col justify-center p-4">
        <h2 className="mb-2 mt-0 text-lg font-bold">{title}</h2>
        <div className="text-white-700">{children}</div>
      </div>
    </div>
  )
}
