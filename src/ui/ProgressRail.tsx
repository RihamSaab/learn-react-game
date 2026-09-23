import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'

type Item = { id: string; label: string }

type Props = {
  items: Item[]
  progress: number
}

/**
 * Picks the section whose top has most recently crossed a line ~35% down the
 * viewport. That anchor point (rather than "topmost visible") means a level is
 * considered active while its header/game are actually in the reading area,
 * not the moment its bottom edge peeks in.
 */
function useActiveSection(idsKey: string) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ids = idsKey.split('|')
    let raf = 0
    const compute = () => {
      const anchor = window.innerHeight * 0.35
      let idx = 0
      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i])
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top - anchor <= 0) idx = i
      }
      setActive((prev) => (prev === idx ? prev : idx))
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
  }, [idsKey])

  return active
}

export function ProgressRail({ items, progress }: Props) {
  const idsKey = useMemo(() => items.map((it) => it.id).join('|'), [items])
  const active = useActiveSection(idsKey)

  return (
    <nav className="rail" aria-label="Depth levels">
      <div className="rail-track">
        <motion.div
          className="rail-fill"
          animate={{ height: `${progress * 100}%` }}
          transition={{ type: 'spring', stiffness: 180, damping: 26 }}
        />
      </div>
      <ul className="rail-list">
        {items.map((it, i) => {
          const isActive = i === active
          return (
            <li key={it.id} className={isActive ? 'active' : ''}>
              <a
                href={`#${it.id}`}
                aria-label={`Jump to level ${i + 1}: ${it.label}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="dot" />
                <span className="rail-label">{it.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
