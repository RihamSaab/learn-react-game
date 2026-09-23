import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type Step = { label: string; text: ReactNode }

type Props = {
  analogy: ReactNode
  steps: Step[]
}

/**
 * Beginner-friendly "behind the scenes" panel. Every level has one — it
 * translates the mini-game into a plain-English explanation of what React
 * actually does internally, plus a real-world analogy. Laid out as a row:
 * analogy on the left, ordered steps as horizontal cards on the right.
 */
export function BehindScenes({ analogy, steps }: Props) {
  return (
    <motion.aside
      className="behind"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <div className="behind-header">
        <span className="behind-badge">Behind the scenes</span>
      </div>

      <div className="behind-row">
        <div className="behind-analogy">
          <span className="behind-icon" aria-hidden>💡</span>
          <p>{analogy}</p>
        </div>

        <ol className="behind-steps">
          {steps.map((s, i) => (
            <li key={i}>
              <span className="step-num">{i + 1}</span>
              <div>
                <strong>{s.label}</strong>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </motion.aside>
  )
}
