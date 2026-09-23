import { useState } from 'react'
import { motion } from 'motion/react'
import { CodeBlock } from '../../ui/CodeBlock'
import { BehindScenes } from '../../ui/BehindScenes'
import { INITIAL_HOOKS, RULE_CODE, type HookCall, type Slot } from './config'
import {
  HookChip,
  HookEditor,
  HookFn,
  HookLine,
  HookSlot,
  SlotLabel,
  TinyLine,
} from './styles'

export function FifthSection() {
  const [calls, setCalls] = useState<HookCall[]>(INITIAL_HOOKS)
  const [dragId, setDragId] = useState<string | null>(null)

  const move = (id: string, slot: Slot) => {
    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, slot } : c)))
  }

  const insideIf = calls.some((c) => c.slot === 'inside-if')
  const allTop = calls.every((c) => c.slot === 'top')

  const reset = () => setCalls(INITIAL_HOOKS)

  return (
    <>
      <div className="level-play right">
        <div className="grid two">
          <div className="panel">
            <h3>Rules of Hooks: only at the top</h3>
            <p className="dim">
              Drag a hook into the <code>if</code> block. React needs the same hooks called in the same
              order every render.
            </p>

            <HookEditor>
              <HookLine>function <HookFn>Widget()</HookFn> {'{'}</HookLine>

              <HookSlot
                $kind="top"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dragId && move(dragId, 'top')}
              >
                <SlotLabel>Top level</SlotLabel>
                {calls
                  .filter((c) => c.slot === 'top')
                  .map((c) => (
                    <HookChip
                      key={c.id}
                      layout
                      $kind="top"
                      draggable
                      onDragStart={() => setDragId(c.id)}
                      onDragEnd={() => setDragId(null)}
                    >
                      {c.label}
                    </HookChip>
                  ))}
                {calls.filter((c) => c.slot === 'top').length === 0 && (
                  <TinyLine>(drop hooks here)</TinyLine>
                )}
              </HookSlot>

              <HookLine>if (condition) {'{'}</HookLine>

              <HookSlot
                $kind="bad"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dragId && move(dragId, 'inside-if')}
              >
                <SlotLabel>Inside condition (illegal)</SlotLabel>
                {calls
                  .filter((c) => c.slot === 'inside-if')
                  .map((c) => (
                    <HookChip
                      key={c.id}
                      layout
                      $kind="bad"
                      draggable
                      onDragStart={() => setDragId(c.id)}
                      onDragEnd={() => setDragId(null)}
                    >
                      {c.label}
                    </HookChip>
                  ))}
                {calls.filter((c) => c.slot === 'inside-if').length === 0 && (
                  <TinyLine>(nothing here, good)</TinyLine>
                )}
              </HookSlot>

              <HookLine>{'}'}</HookLine>
              <HookLine>{'}'}</HookLine>
            </HookEditor>

            <div className="actions">
              <button onClick={reset}>Reset</button>
              {allTop && (
                <motion.span className="badge ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  ✓ Hook order is stable
                </motion.span>
              )}
            </div>
          </div>

          <div className="panel">
            <h3>What React does</h3>
            <p className="dim">
              React identifies hook state by <em>call order</em>, not name. If a call gets skipped
              (say the <code>if</code> is false), every hook after it shifts by one.
            </p>

            {insideIf ? (
              <motion.div
                className="error-banner"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <strong>React Error</strong>
                <div>Rendered fewer hooks than expected.</div>
                <small>
                  A hook was called conditionally. The number of hooks called during renders must be the
                  same across all renders.
                </small>
              </motion.div>
            ) : (
              <motion.div
                className="success-banner"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <strong>All good</strong>
                <div>All hooks are called unconditionally at the top level.</div>
              </motion.div>
            )}

            <CodeBlock label="Rule">{RULE_CODE}</CodeBlock>
          </div>
        </div>
      </div>

      <BehindScenes
        analogy={
          <>
            Think of hooks like <strong>numbered lockers in a hallway</strong>. Every time
            you visit, you must open them in the same order: 1, 2, 3. Skip one, and the
            contents of locker 2 end up in locker 1. Now everything is in the wrong place.
          </>
        }
        steps={[
          {
            label: "React doesn't remember hooks by name",
            text: (
              <>
                When your component runs, React makes a list of every hook call. But it
                tags them by <em>position</em>, not by variable name.
              </>
            ),
          },
          {
            label: 'On the next render, it matches by position',
            text: (
              <>
                The 1st hook this render is compared to the 1st hook last render. If a
                hook is skipped (because it was inside an <code>if</code>), every hook
                after it shifts up by one. Chaos.
              </>
            ),
          },
          {
            label: 'The rule keeps that list consistent',
            text: (
              <>
                Calling hooks always, at the top, in the same order, means the list is the
                same every time. This is how <code>useState</code> can remember your value
                across renders, even though it's just a function call.
              </>
            ),
          },
        ]}
      />
    </>
  )
}
