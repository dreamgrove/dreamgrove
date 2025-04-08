export default function BossCard({ title, children }) {
  return (
    <div className={`mb-16 mt-4 ${!children || children.length === 0 ? 'hidden' : ''}`}>
      <div className="items-bottom flex min-h-[64px]">
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
