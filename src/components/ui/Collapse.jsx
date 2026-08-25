import { useEffect, useRef, useState } from 'react'

/**
 * Height-animated disclosure. Measures its content instead of leaning on the
 * `grid-template-rows: 0fr` trick, which silently refuses to collapse when
 * the item's automatic minimum size wins over the flex track.
 */
export default function Collapse({ open, children, className = '' }) {
  const ref = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setHeight(el.scrollHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [children])

  return (
    <div
      aria-hidden={!open}
      style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      className={`overflow-hidden transition-[height,opacity] duration-300 ease-out ${className}`}
    >
      <div ref={ref}>{children}</div>
    </div>
  )
}
