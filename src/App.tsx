import { useRef } from 'react'
import { motion } from 'motion/react'
import { Scene } from './three/Scene'
import { ProgressRail } from './ui/ProgressRail'
import { Level } from './ui/Level'
import { FirstSection } from './sections/firstSection'
import { SecondSection } from './sections/secondSection'
import { ThirdSection } from './sections/thirdSection'
import { FourthSection } from './sections/fourthSection'
import { FifthSection } from './sections/fifthSection'
import { FinaleSection } from './sections/finaleSection'
import { useScrollProgress } from './hooks/useScrollProgress'
import './App.css'

const LEVELS = [
  { id: 'level-1', label: 'Components' },
  { id: 'level-2', label: 'Props' },
  { id: 'level-3', label: 'State' },
  { id: 'level-4', label: 'Effects' },
  { id: 'level-5', label: 'Rules of Hooks' },
]

const ORDINALS = ['First', 'Second', 'Third', 'Fourth', 'Fifth']

function App() {
  const { ref: scrollRef, value: scrollValue } = useScrollProgress()
  const pulseRef = useRef(0)

  return (
    <>
      <Scene scroll={scrollRef} pulse={pulseRef} />

      <ProgressRail items={LEVELS} progress={scrollValue} />

      <main className="app">
        <header className="hero">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Learn React <span className="hero-accent">with me</span>
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            React powers a huge share of the modern web, and it only has a
            handful of rules. We'll fly through five little space stations,
            one per rule, and you'll play a small game at each one.
          </motion.p>

          <motion.a
            href="#level-1"
            className="cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            whileHover={{ y: -3 }}
          >
            Start the Game
          </motion.a>

          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <span className="scroll-arrow" aria-hidden>↓</span>
            <span>scroll to start the game</span>
          </motion.div>
        </header>

        <Level
          id="level-1"
          index={1}
          eyebrow={`Game 01 · ${ORDINALS[0]} rule`}
          title="Components"
          theme="blocks"
          subtitle={
            <>
              A component is a reusable piece of UI. You compose apps by nesting them, like{' '}
              <code>&lt;Header/&gt;</code> inside <code>&lt;App/&gt;</code>.
            </>
          }
        >
          <FirstSection />
        </Level>

        <Level
          id="level-2"
          index={2}
          eyebrow={`Game 02 · ${ORDINALS[1]} rule`}
          title="Props"
          theme="flow"
          subtitle={
            <>
              Props pass data from parent to child. They are <em>read-only</em>, so a child
              can't change its parent's data by touching them.
            </>
          }
        >
          <SecondSection />
        </Level>

        <Level
          id="level-3"
          index={3}
          eyebrow={`Game 03 · ${ORDINALS[2]} rule`}
          title="State"
          theme="core"
          subtitle={
            <>
              State is data a component owns. Update it with the setter and React re-renders.
              Mutating it directly does nothing.
            </>
          }
        >
          <ThirdSection pulse={pulseRef} />
        </Level>

        <Level
          id="level-4"
          index={4}
          eyebrow={`Game 04 · ${ORDINALS[3]} rule`}
          title="Effects & cleanup"
          theme="gyro"
          subtitle={
            <>
              <code>useEffect</code> runs after render for side effects like subscriptions, timers,
              or external systems. Return a cleanup function to undo them.
            </>
          }
        >
          <FourthSection />
        </Level>

        <Level
          id="level-5"
          index={5}
          eyebrow={`Game 05 · ${ORDINALS[4]} rule`}
          title="Rules of Hooks"
          theme="stack"
          subtitle={
            <>
              Hooks must be called at the top level of your component. Never inside conditions,
              loops, or after an early return.
            </>
          }
        >
          <FifthSection />
        </Level>

        <FinaleSection />
      </main>
    </>
  )
}

export default App
