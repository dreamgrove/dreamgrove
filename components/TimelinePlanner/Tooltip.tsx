'use client'
// components/Tooltip.tsx
import React, { useEffect, useRef, useState, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useHoverContext } from './HoverProvider'
import { useTimelineControls } from './TimelineContext'
import { formatTime } from './TimelineView'
import { Cast, SpellInfo } from 'lib/types/cd_planner'
type Props = {
  x?: number
  y?: number
  portal?: boolean
  isOverlay?: boolean
  mouseTooltip?: boolean
  id?: string
  width?: number
  coordinates?: { x: number; y: number }
  isDragging?: boolean
}

const Tooltip: React.FC<Props> = ({
  x = 0,
  y = 0,
  width = 0,
  isOverlay = false,
  mouseTooltip = false,
  id = '',
  coordinates = { x: 0, y: 0 },
  isDragging = false,
}) => {
  const { scrollContainer, pixelsToTime, isShiftKeyPressed } = useTimelineControls()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const boundingBox = scrollContainer?.getBoundingClientRect()

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const { cast } = useHoverContext()

  const isMouseInTimeline = useMemo(() => {
    if (!boundingBox) return false
    return (
      mousePos.x > boundingBox.left &&
      mousePos.x < boundingBox.right &&
      mousePos.y > boundingBox.top &&
      mousePos.y < boundingBox.bottom
    )
  }, [boundingBox, mousePos])

  if (!boundingBox) return null

  if (
    (isDragging && isOverlay) ||
    (isShiftKeyPressed && !isOverlay && !isDragging && isMouseInTimeline) ||
    (mouseTooltip && isShiftKeyPressed)
  ) {
    const transition = !isOverlay ? '' : ''
    const pixelOffset = Math.max(mousePos.x - boundingBox.left - 25, 0)
    const time = formatTime(pixelsToTime(pixelOffset))

    const tooltip = (
      <div
        className="animate-expand box-border rounded-sm bg-neutral-900 text-xs"
        style={{
          position: 'absolute',
          top: cast ? coordinates.y + 43 : mousePos.y + 0,
          left: cast ? coordinates.x : mousePos.x - 65,
          pointerEvents: 'none',
          color: 'white',
          width: !mouseTooltip ? width : 'auto',
          opacity: 1,
          whiteSpace: 'nowrap',
          zIndex: isOverlay ? 1010 : 1000,
          transform: 'translateZ(0)',
          visibility: 'visible',
        }}
      >
        {cast && !mouseTooltip && <CastTooltip cast={cast} width={width} />}
        {!cast && mouseTooltip && <MouseTooltip time={time} />}
      </div>
    )

    if (mouseTooltip && !cast) return ReactDOM.createPortal(tooltip, document.body)
    if (cast && cast.id === id) {
      if (isOverlay) {
        return tooltip
      } else {
        return ReactDOM.createPortal(tooltip, document.body)
      }
    }
  }

  return null
}

const MouseTooltip = ({ time }: { time: string }) => {
  return <div className="box-border bg-neutral-950/80 px-2 py-1 text-xs">{time}</div>
}

const CastTooltip = ({ cast, width }: { cast: Cast; width: number }) => {
  //round to 1 decimal place
  const startTime = Math.max(0, Math.round(cast.start_s * 10) / 10)
  const endTime = Math.max(0, Math.round(cast.end_s * 10) / 10)
  return (
    <div
      className="box-border px-2 py-1 text-xs"
      style={{
        width: width,
        whiteSpace: 'nowrap',
        zIndex: 1000,
      }}
    >
      <div className="flex flex-row">
        <div className="w-12">{startTime}s</div>
        <div className="mt-[7px] h-[3px] flex-1 bg-neutral-400/20" />
        <div className="w-12 text-right">{endTime}s</div>
      </div>
    </div>
  )
}

export default Tooltip
