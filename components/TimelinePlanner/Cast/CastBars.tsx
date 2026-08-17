import { Cast } from '@/models/Cast'

interface CastBarsProps {
  cast: Cast
  pixelsPerSecond: number
  transitionStyle?: string
}

/**
 * The four visual bars of a cast (channel / effect / delayed cooldown / cooldown).
 */
export default function CastBars({
  cast,
  pixelsPerSecond,
  transitionStyle = 'transition-all duration-100',
}: CastBarsProps) {
  const channel_width_px = cast.channel_length * pixelsPerSecond
  const effect_width_px = cast.effect_length * pixelsPerSecond
  const cooldown_width_px = cast.cooldown_length * pixelsPerSecond

  return (
    <>
      {/* Channel Duration Bar */}
      <div
        className={`bg-cyan-400/00 absolute bottom-0 left-0 z-20 h-[30%] items-center justify-center border-dashed focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
        style={{
          background:
            'repeating-linear-gradient(45deg, #1f1f1fB3, #1f1f1fB3 4px, oklch(59.6% 0.145 163.225) 4px, oklch(59.6% 0.145 163.225) 8px)',
          width: `${channel_width_px + 0}px`,
          left: 3,
          borderColor: cast.is_interruped ? 'oklch(79.5% 0.184 86.047)' : 'transparent',
          borderWidth: cast.is_interruped ? '0 1px 0 0 ' : '0px',
        }}
      />
      {/* Effect Duration Bar. Sorry for the extra pixel */}
      <div
        className={`border-main/60 absolute top-0 left-0 z-10 box-content flex h-[80%] items-center justify-start border-l-2 bg-emerald-800/50 shadow-2xl focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
        style={{
          width: `${effect_width_px + 1}px`,
        }}
      />
      {/* Delayed Cooldown Bar */}
      <div
        className={`border-main/60 absolute bottom-0 left-0 z-[5] flex h-[100%] items-center justify-start border-l-2 bg-neutral-900/70 focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
        style={{
          background:
            'repeating-linear-gradient(45deg, transparent, transparent 5px, #17171A 4px, #17171A 10px)',
          width: `${(cast._cd_start_s - cast.start_s) * pixelsPerSecond}px`,
        }}
      />
      {/* Cooldown Bar */}
      <div
        className={`absolute bottom-0 left-0 z-0 flex h-[100%] items-center justify-center bg-neutral-900/70 focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
        style={{
          left: (cast._cd_start_s - cast.start_s) * pixelsPerSecond,
          width: `${cooldown_width_px + 1}px`,
        }}
      />
    </>
  )
}
