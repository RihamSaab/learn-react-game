import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CodeBlock } from '../../ui/CodeBlock'
import { BehindScenes } from '../../ui/BehindScenes'
import { codeSample, fakeFetchTip } from './config'
import {
  ButtonRow,
  Goal,
  GoalChip,
  GoalLabel,
  Spinner,
  SpinnerWrap,
  TipCard,
  TipLabel,
  TipQuote,
} from './styles'

export function FourthSection() {
  const [tip, setTip] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fakeFetchTip().then((t) => {
      if (cancelled) return
      setTip(t)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  const solved = tip !== null && !loading

  const getAnother = () => setRefreshKey((k) => k + 1)

  const goToNextSection = () => {
    document.getElementById('level-5')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="level-play left">
        <div className="grid two">
          <div className="panel">
            <Goal>
              <GoalLabel>🎯 Goal</GoalLabel>
              <span>useEffect is where</span>
              <GoalChip>data fetching</GoalChip>
              <span>happens. Watch it load a tip.</span>
            </Goal>
            <p className="dim">
              When this section mounts, useEffect kicks off an async fetch. React shows
              a loading state, then re-renders with the result once the promise resolves.
              Click "Get another" to re-run the effect through its dependency.
            </p>

            <CodeBlock label="useEffect with dependency">{codeSample}</CodeBlock>

            <ButtonRow>
              <button className="primary" onClick={getAnother} disabled={loading}>
                {loading ? 'Fetching...' : 'Get another tip'}
              </button>
            </ButtonRow>

            {solved && (
              <motion.div
                className="success-banner"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <strong>✓ Tip loaded via useEffect</strong>
                <div>
                  That's the everyday pattern: mount, effect fetches, state updates, React
                  re-renders with the data.
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
            <h3>React tip</h3>
            <TipCard>
              <TipLabel>Random tip</TipLabel>
              <AnimatePresence mode="wait">
                {loading || !tip ? (
                  <SpinnerWrap
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Spinner />
                    <span>Fetching a tip...</span>
                  </SpinnerWrap>
                ) : (
                  <TipQuote
                    key={tip}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    "{tip}"
                  </TipQuote>
                )}
              </AnimatePresence>
            </TipCard>
          </div>
        </div>
      </div>

      <BehindScenes
        analogy={
          <>
            Think of useEffect like <strong>sending a letter through a slow window</strong>.
            React shows the UI first, then walks over to the window, sends the request, and
            updates the UI once the response comes back.
          </>
        }
        steps={[
          {
            label: 'React renders first, without waiting',
            text: (
              <>
                The UI paints immediately with whatever state you have, usually a loading
                placeholder. React doesn't block on async work.
              </>
            ),
          },
          {
            label: 'After paint, the effect runs',
            text: (
              <>
                Your fetch, subscription, or timer kicks off. When the response arrives,
                you update state and React re-renders with the fresh data.
              </>
            ),
          },
          {
            label: 'The dependency array controls when it re-runs',
            text: (
              <>
                <code>[]</code> means run once on mount. <code>[value]</code> means re-run
                whenever <code>value</code> changes, like a refresh trigger.
              </>
            ),
          },
        ]}
      />
    </>
  )
}
