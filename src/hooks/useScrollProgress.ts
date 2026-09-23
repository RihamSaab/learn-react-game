import { useEffect, useRef, useState } from 'react'

export type ScrollRef = { current: number }

/**
 * Tracks vertical scroll as 0..1 progress. Returns:
 *   ref     — mutable, updated on rAF (safe to read inside R3F useFrame)
 *   value   — reactive, updated ~15fps for UI that must re-render (progress rail)
 */
export function useScrollProgress() {
  const ref = useRef(0)
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf = 0
    let lastReactUpdate = 0

    const compute = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      ref.current = p
      const now = performance.now()
      if (now - lastReactUpdate > 60) {
        lastReactUpdate = now
        setValue(p)
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { ref, value }
}
