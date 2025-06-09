import { useRef, useEffect } from 'react'
import { useTimelineControls } from '@/components/TimelinePlanner/Providers/TimelineLengthProvider'

export function useTimelineScroll() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { isControlKeyPressed, registerScrollContainer, zoomIn, zoomOut } = useTimelineControls()

  useEffect(() => {
    if (scrollContainerRef.current) {
      registerScrollContainer(scrollContainerRef.current)
    }
  }, [registerScrollContainer])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    const handleWheel = (e: WheelEvent) => {
      if (scrollContainer) {
        e.preventDefault()
        if (isControlKeyPressed || e.ctrlKey) {
          if (e.deltaY > 0) {
            zoomOut(5)
          } else {
            zoomIn(5)
          }
        } else {
          scrollContainer.scrollLeft += e.deltaY
        }
      }
    }

    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('wheel', handleWheel)
      }
    }
  }, [isControlKeyPressed, zoomIn, zoomOut])

  return {
    scrollContainerRef,
  }
}
