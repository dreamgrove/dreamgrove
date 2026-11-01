'use client'

export default function Switch({
  label,
  title,
  checked,
  onChange,
}: {
  label: string
  title: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      title={title}
      className="flex cursor-pointer items-center gap-2 text-[.8rem] font-semibold whitespace-nowrap text-white/60 select-none"
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={`relative h-4 w-7 rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-white ${
          checked ? 'bg-main' : 'bg-dg-line'
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-[left] ${
            checked ? 'left-3.5' : 'left-0.5'
          }`}
        />
      </span>
      {label}
    </label>
  )
}
