import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { CodeBlock } from '../../ui/CodeBlock'
import { BehindScenes } from '../../ui/BehindScenes'
import type { ScrollRef } from '../../hooks/useScrollProgress'
import { CODE_RIGHT, INITIAL_COUNT, TARGET_COUNT } from './config'
import {
  CounterBox,
  CounterValue,
  Goal,
  GoalChip,
  GoalLabel,
  StatList,
} from './styles'

type Props = {
  /** Written to on each setState call; the 3D scene reads this to pulse. */
  pulse: ScrollRef
}

export function ThirdSection({ pulse }: Props) {
  const [count, setCount] = useState(INITIAL_COUNT)

  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  const solved = count >= TARGET_COUNT

  const inc = () => {
    setCount((c) => c + 1)
    pulse.current = 1
  }

  const reset = () => setCount(INITIAL_COUNT)

  const goToNextSection = () => {
    document.getElementById('level-4')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="level-play right">
        <div className="grid two">
          <div className="panel">
            <Goal>
              <GoalLabel>🎯 Goal</GoalLabel>
              <span>Reach</span>
              <GoalChip>{TARGET_COUNT} clicks</GoalChip>
            </Goal>
            <p className="dim">
              Each click calls <code>setCount</code>. React notices, re-renders, and the number
              on screen updates.
            </p>

            <CounterBox>
              <CounterValue
                key={count}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                {count}
              </CounterValue>
              <button className="primary" onClick={inc} disabled={solved}>
                setCount(c =&gt; c + 1)
              </button>
              <button onClick={reset} disabled={count === 0}>
                Reset
              </button>
            </CounterBox>

            {solved && (
              <motion.div
                className="success-banner"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <strong>✓ Reached {TARGET_COUNT}</strong>
                <div>
                  Every click told React the state changed, and React re-rendered the component
                  so the new number showed up.
                </div>
                <div className="actions">
                  <button className="primary" onClick={goToNextSection}>
                    Next challenge →
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="panel">
            <h3>What React is doing</h3>
            <p className="dim">
              A render is React calling your component function again. The counter changes
              because a new render produced a new number.
            </p>

            <StatList>
              <li>Renders since mount: <strong>{renderCountRef.current}</strong></li>
              <li>Clicks so far: <strong>{count}</strong></li>
            </StatList>

            <CodeBlock label="The pattern">{CODE_RIGHT}</CodeBlock>
          </div>
        </div>
      </div>

      <BehindScenes
        analogy={
          <>
            Think of state like a <strong>scoreboard at a game</strong>. When the score
            changes, someone has to flip the number so the crowd can see it. Just writing
            a new score on a piece of paper in your pocket won't update the board.
          </>
        }
        steps={[
          {
            label: 'You tell React the value changed',
            text: (
              <>
                Calling <code>setCount(...)</code> is telling React: "please note this new
                value and update the screen."
              </>
            ),
          },
          {
            label: 'React re-runs your component',
            text: (
              <>
                A "re-render" is React calling your function again. It gets the new value,
                computes the new UI description, and shows it.
              </>
            ),
          },
          {
            label: 'The new render puts the new number on screen',
            text: (
              <>
                Because the number comes from state, and state changed, the new function
                call produces a new number, and that's what you see.
              </>
            ),
          },
        ]}
      />
    </>
  )
}
