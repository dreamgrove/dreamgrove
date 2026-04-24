export default function BossCard({ title, children }) {
  return (
    <section
      className={`boss-card mt-6 mb-16 ${!children || children.length === 0 ? 'hidden' : ''}`}
    >
      <header className="boss-card__header">
        <div className="boss-card__titleblock">
          <h2 className="boss-card__title">{title}</h2>
        </div>
      </header>
      <div className="w-full px-1 py-2 md:px-4 [&>div]:list-none">{children}</div>
    </section>
  )
}
