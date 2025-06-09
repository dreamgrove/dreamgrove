import { useTimelineControls } from '../Providers/TimelineLengthProvider'

export default function ZoomControls() {
  const { resetZoom, zoomOut, zoomIn } = useTimelineControls()

  return (
    <div id="tour-zoom-selector" className="flex flex-row items-center justify-end gap-2 pr-4">
      <button
        onClick={() => resetZoom()}
        className="rounded-sm bg-neutral-900/40 px-3 py-1 text-sm transition-colors duration-200 hover:bg-neutral-700/70"
      >
        Reset Zoom
      </button>
      <button
        onClick={() => zoomOut(10)}
        className="flex min-w-[1.5rem] items-center justify-center rounded-sm bg-neutral-900/40 px-3 py-1 text-sm transition-colors duration-200 hover:bg-neutral-700/70"
      >
        -
      </button>
      <button
        onClick={() => zoomIn(10)}
        className="flex min-w-[1.5rem] items-center justify-center rounded-sm bg-neutral-900/40 px-3 py-1 text-sm transition-colors duration-200 hover:bg-neutral-700/70"
      >
        +
      </button>
    </div>
  )
}
