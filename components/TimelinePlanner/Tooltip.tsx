'use client'
import React, { useEffect, useState, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useHoverContext } from './Providers/HoverProvider'
import { useTimelineControls } from './Providers/TimelineLengthProvider'
import { formatTime } from '../../lib/utils/utilityFunctions'
import { Cast } from '@/models/Cast'
import { useSettings } from './Providers/SettingsProvider'

const Tooltip: React.FC = () => {
  const {
    scrollContainer,
    pixelsToTime,
    isShiftKeyPressed,
    pixelsPerSecond,
    scrollContainerWidth,
  } = useTimelineControls()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const boundingBox = scrollContainer?.getBoundingClientRect()
  const { cast, rectRef, isDragging } = useHoverContext()

  const width = cast ? cast.duration_s * pixelsPerSecond : 1

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

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

  const renderCast = cast !== null && (isDragging || (!isDragging && isShiftKeyPressed)) //render cast only when dragging or when not dragging and shift is pressed
  const renderMouse = isShiftKeyPressed && isMouseInTimeline && !renderCast && !isDragging //default render mouse only we're in a timeline and we're pressing shift

  const x = renderCast ? rectRef?.current?.getBoundingClientRect()?.left : mousePos.x - 70
  const y = renderCast ? rectRef?.current?.getBoundingClientRect()?.top : mousePos.y - 45

  const c = {
    x: Math.max(0, x ?? 0),
    y: Math.max(0, y ?? 0),
  }

  if (renderMouse || renderCast) {
    const pixelOffset = Math.max(mousePos.x - boundingBox.left - 25, 0)
    const time = formatTime(pixelsToTime(pixelOffset))

    const tooltip = (
      <div
        className={`animate-expand box-border min-w-fit rounded-sm bg-neutral-900 text-xs`}
        style={{
          position: 'absolute',
          top: c.y + 43,
          left: c.x,
          pointerEvents: 'none',
          color: 'white',
          width: Math.min(width, boundingBox.left + scrollContainerWidth - c.x),
          opacity: 1,
          whiteSpace: 'nowrap',
          zIndex: 1000,
          transform: 'translateZ(0)',
          visibility: 'visible',
        }}
      >
        {renderCast && <CastTooltip cast={cast} width={width} />}
        {renderMouse && <MouseTooltip time={time} />}
      </div>
    )

    return ReactDOM.createPortal(tooltip, document.body)
  }

  return null
}

const MouseTooltip = ({ time }: { time: string }) => {
  return <div className="relative box-border bg-neutral-950/80 px-2 py-1 text-xs">{time}</div>
}

const CastTooltip = ({ cast, width }: { cast: Cast; width: number }) => {
  const { timestampFormat } = useSettings()
  //round to 1 decimal place
  const startTime = Math.max(0, Math.round(cast.start_s * 10) / 10)
  const endTime = Math.max(0, Math.round(cast.end_s * 10) / 10)
  const startTimeFormatted = timestampFormat === 'seconds' ? startTime : formatTime(startTime)
  const endTimeFormatted = timestampFormat === 'seconds' ? endTime : formatTime(endTime)
  return (
    <div
      className="box-border px-2 py-1 text-xs"
      style={{
        whiteSpace: 'nowrap',
        zIndex: 1000,
      }}
    >
      <div className="flex flex-row">
        <div className="w-12">{startTimeFormatted}s</div>
        <div className="mt-[7px] h-[3px] flex-1 bg-neutral-400/20" />
        <div className="w-12 text-right">{endTimeFormatted}s</div>
      </div>
    </div>
  )
}

export default Tooltip
