/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
export default function BossCard({ title, image, children }) {
  return (
    <div
      className={`mb-6 flex w-full rounded-lg border border-gray-300 shadow-lg ${children.length == 0 ? 'hidden' : ''}`}
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
