import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type Theme = 'blocks' | 'flow' | 'core' | 'gyro' | 'stack'

type Props = {
  id: string
  index: number
  eyebrow: string
  title: string
  subtitle: ReactNode
  theme: Theme
  children: ReactNode
}

export function Level({ id, index, eyebrow, title, subtitle, theme, children }: Props) {
  return (
    <section id={id} className={`level ${theme}`}>
      <motion.div
        className="level-header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="level-eyebrow">
          <span className="level-index">{String(index).padStart(2, '0')}</span>
          {eyebrow}
        </span>
        <h2 className="level-title">{title}</h2>
        <p className="level-subtitle">{subtitle}</p>
      </motion.div>

      <motion.div
        className="level-body"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {children}
      </motion.div>
    </section>
  )
}
