import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CodeBlock } from '../../ui/CodeBlock'
import { BehindScenes } from '../../ui/BehindScenes'
import { codeFor, LOG_MAX, TICK_MS, type LogEntry } from './config'
import {
  Goal,
  GoalChip,
  GoalLabel,
  Log,
  LogLine,
  LogTag,
  Switch,
  ToggleRow,
} from './styles'

let idSeq = 0

function Subscriber({
  cleanup,
  onLog,
}: {
  cleanup: boolean
  onLog: (e: Omit<LogEntry, 'id'>) => void
}) {
  useEffect(() => {
    onLog({ kind: 'sub', text: 'subscribed to server' })
    const t = setInterval(() => {
      onLog({ kind: 'tick', text: 'tick received' })
    }, TICK_MS)

    if (cleanup) {
      return () => {
        clearInterval(t)
        onLog({ kind: 'clean', text: 'cleanup ran, unsubscribed' })
      }
    }
    return () => {
      onLog({ kind: 'warn', text: 'component unmounted WITHOUT cleanup, interval leaks!' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

export function FourthSection() {
  const [mounted, setMounted] = useState(false)
  const [cleanup, setCleanup] = useState(true)
  const [log, setLog] = useState<LogEntry[]>([])

  const push = (e: Omit<LogEntry, 'id'>) =>
    setLog((prev) => [...prev.slice(-(LOG_MAX - 1)), { ...e, id: ++idSeq }])

  const reset = () => {
    setLog([])
    setMounted(false)
  }

  /** The player wins by producing a real cleanup event in the log, which only
   *  happens if they had cleanup ON, mounted, then unmounted. */
  const solved = log.some((e) => e.kind === 'clean')

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
              <span>Complete a full cycle: get a</span>
              <GoalChip>clean</GoalChip>
              <span>entry in the log.</span>
            </Goal>
            <p className="dim">
              Toggle cleanup, mount the subscriber, then unmount it. With cleanup on, unmount
              stops the interval. Without cleanup, the interval leaks.
            </p>

            <ToggleRow>
              <Switch>
                <input
                  type="checkbox"
                  checked={cleanup}
                  onChange={(e) => setCleanup(e.target.checked)}
                />
                <span>Return cleanup function</span>
              </Switch>

              <button
                className={mounted ? 'danger' : 'primary'}
                onClick={() => setMounted((m) => !m)}
              >
                {mounted ? 'Unmount' : 'Mount'} &lt;Subscriber /&gt;
              </button>

              <button onClick={reset}>Reset log</button>
            </ToggleRow>

            <CodeBlock label="useEffect">{codeFor(cleanup)}</CodeBlock>

            {solved && (
              <motion.div
                className="success-banner"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <strong>✓ Clean cycle complete</strong>
                <div>
                  The cleanup function stopped the interval. That's how effects don't leak.
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
            <h3>Event log</h3>
            <Log>
              <AnimatePresence initial={false}>
                {log.map((e) => (
                  <LogLine
                    key={e.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    $kind={e.kind}
                  >
                    <LogTag>{e.kind}</LogTag>
                    {e.text}
                  </LogLine>
                ))}
              </AnimatePresence>
              {log.length === 0 && <p className="dim">Mount the subscriber to begin.</p>}
            </Log>
            {mounted && <Subscriber cleanup={cleanup} onLog={push} />}
          </div>
        </div>
      </div>

      <BehindScenes
        analogy={
          <>
            Think of an effect like <strong>turning on a tap</strong>. When you're done
            washing, you have to turn it off. Otherwise water keeps flowing. Cleanup is
            the "turn off the tap" step.
          </>
        }
        steps={[
          {
            label: 'React renders your component',
            text: (
              <>
                First, React runs your function and shows the UI. It hasn't run your
                effect yet.
              </>
            ),
          },
          {
            label: 'After the screen updates, the effect runs',
            text: (
              <>
                This is the safe place to do things outside React: start a timer, fetch
                data, subscribe to something, listen for events.
              </>
            ),
          },
          {
            label: 'When the component leaves, cleanup runs',
            text: (
              <>
                The function you <em>return</em> from useEffect is React's way of saying
                "here's how to undo what I just started." Skip it and you leak: old timers,
                stale listeners, and hard-to-find bugs.
              </>
            ),
          },
        ]}
      />
    </>
  )
}
