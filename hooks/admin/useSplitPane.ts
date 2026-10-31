import { useEffect, useState, type RefObject } from 'react'
import { usePersistedState } from './usePersistedState'

const MIN = 20
const MAX = 80

/** Draggable divider between two panes in `containerRef` */
export function useSplitPane(containerRef: RefObject<HTMLElement | null>) {
  const [saved, setSaved] = usePersistedState<string>('editor-split-position', '50')
  const [dragPosition, setDragPosition] = useState<number | null>(null)
  const dragging = dragPosition !== null

  useEffect(() => {
    if (!dragging) return
    let latest: number | null = null
    const onMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      latest = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, MIN), MAX)
      setDragPosition(latest)
    }
    const onUp = () => {
      if (latest !== null) setSaved(String(latest))
      setDragPosition(null)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.body.style.cursor = 'col-resize'
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
    }
  }, [dragging, containerRef, setSaved])

  const position = dragPosition ?? (Number(saved) || 50)

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragPosition(position)
  }

  return { position, dragging, startDrag }
}
