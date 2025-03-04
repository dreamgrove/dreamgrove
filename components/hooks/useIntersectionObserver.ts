import { useEffect, useState, useRef, RefObject } from 'react'
import { useLogger } from './useLogger'

interface IntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

/**
 * A hook that observes when an element enters or exits the viewport
 * @param options IntersectionObserver options
 * @returns [ref, isIntersecting] where ref is the reference to attach to the element and isIntersecting indicates if the element is in view
 */
export const useIntersectionObserver = <T extends Element>(
  options: IntersectionObserverOptions = {},
  componentName: string = 'useIntersectionObserver'
): [RefObject<T>, boolean] => {
  const logger = useLogger(componentName)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const newIsIntersecting = entry.isIntersecting
        if (newIsIntersecting !== isIntersecting) {
          setIsIntersecting(newIsIntersecting)
        }
      },
      {
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold || 0,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options.root, options.rootMargin, options.threshold, isIntersecting, logger])

  return [ref, isIntersecting]
}
