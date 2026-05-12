/* eslint-disable @next/next/no-img-element */
import { fetchWowheadData } from 'app/api/wowhead-data/server-function'

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
        name: title,
      })

      if (data.icon) {
        imageUrl = `https://wow.zamimg.com/images/wow/icons/large/${data.icon}.jpg`
      }
    } catch (error) {
      console.error('Error fetching boss image:', error)
    }
  }

  const hasImage = imageUrl !== ''

  return (
    <section
      className={`boss-card mt-6 mb-16 ${!children || children.length === 0 ? 'hidden' : ''}`}
    >
      <header className={`boss-card__header ${hasImage ? 'boss-card__header--overlay' : ''}`}>
        <div className="boss-card__titleblock">
          <h2 className="boss-card__title">{title}</h2>
        </div>
        {hasImage && (
          <div className="boss-card__portrait">
            <img src={imageUrl} alt={title} className="boss-card__image" />
          </div>
        )}
      </header>
      <div className="w-full px-1 py-2 md:px-4 [&>div]:list-none">{children}</div>
    </section>
  )
}
