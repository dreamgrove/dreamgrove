import React from 'react'

interface TalentChoiceNodeProps {
  label?: string
  children: React.ReactNode
}

const TalentChoiceNode = ({ label, children }: TalentChoiceNodeProps) => {
  return (
    <div role="group" aria-label={label} className="relative md:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2">{children}</div>

      <div className="bg-main/40 pointer-events-none absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 md:hidden"></div>
      <div className="bg-main/40 pointer-events-none absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 md:block"></div>

      <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="border-main flex h-6 w-6 rotate-45 items-center justify-center border bg-neutral-900">
          <div
            className="bg-main h-3.5 w-3.5 -rotate-45"
            style={{
              maskImage: "url('/static/icons/chain.svg')",
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskImage: "url('/static/icons/chain.svg')",
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(TalentChoiceNode)
