import { useState } from 'react'
import { motion } from 'motion/react'
import { CodeBlock } from '../../ui/CodeBlock'
import { BehindScenes } from '../../ui/BehindScenes'
import { CHAIN_NODES, COLORS, NAMES, pickDifferent } from './config'
import {
  Chain,
  ChainName,
  ChainNode,
  ChainSwatch,
  Goal,
  GoalChip,
  GoalLabel,
  Swatch,
  Swatches,
} from './styles'

export function SecondSection() {
  const [color, setColor] = useState<string>(COLORS[0])
  const [target] = useState<string>(() => pickDifferent(COLORS[0]))

  const solved = color === target

  const goToNextSection = () => {
    document.getElementById('level-3')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="level-play left">
        <div className="grid two">
          <div className="panel">
            <Goal>
              <GoalLabel>🎯 Goal</GoalLabel>
              <span>Make the whole chain</span>
              <GoalChip
                style={{ background: `${target}22`, borderColor: target, color: target }}
              >
                {NAMES[target]}
              </GoalChip>
            </Goal>
            <p className="dim">
              The parent owns the value. Pick a color at the top and it flows{' '}
              <em>down</em> as a prop.
            </p>
            <Swatches>
              {COLORS.map((c) => (
                <Swatch
                  key={c}
                  $active={c === color}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Pick ${NAMES[c]}`}
                />
              ))}
            </Swatches>

            {solved ? (
              <motion.div
                className="success-banner"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <strong>✓ Prop delivered</strong>
                <div>
                  Parent → Child → GrandChild all show <em>{NAMES[color]}</em>.
                </div>
                <div className="actions">
                  <button className="primary" onClick={goToNextSection}>
                    Next challenge →
                  </button>
                </div>
              </motion.div>
            ) : (
              <CodeBlock label="Data flows down">
{`<Parent color="${NAMES[color]}">
  <Child>
    <GrandChild />
  </Child>
</Parent>`}
              </CodeBlock>
            )}
          </div>

          <div className="panel">
            <h3>The chain</h3>
            <Chain>
              {CHAIN_NODES.map((name, i) => (
                <ChainNode key={name}>
                  <ChainName>{name}</ChainName>
                  <ChainSwatch
                    animate={{ background: color }}
                    transition={{ duration: 0.6, delay: i * 0.12 }}
                  />
                  <code>color=&quot;{color}&quot;</code>
                </ChainNode>
              ))}
            </Chain>
          </div>
        </div>
      </div>

      <BehindScenes
        analogy={
          <>
            Think of props like a <strong>package delivered from parent to child</strong>.
            The parent packs the box, hands it down, and the child opens it. The child
            can look inside, but it can't change the sender's copy.
          </>
        }
        steps={[
          {
            label: 'Attributes become an object',
            text: (
              <>
                When you write <code>&lt;Child color=&quot;blue&quot; /&gt;</code>, React
                bundles those attributes into one object:{' '}
                <code>{`{ color: "blue" }`}</code>.
              </>
            ),
          },
          {
            label: 'React calls the child with that object',
            text: (
              <>
                It's like calling <code>Child({`{ color: "blue" }`})</code>. Inside, you
                read it as <code>props.color</code>.
              </>
            ),
          },
          {
            label: 'Data only flows one way, down',
            text: (
              <>
                If the child could change the parent's data, React couldn't predict what to
                render next. Read-only props keep the flow predictable.
              </>
            ),
          },
        ]}
      />
    </>
  )
}
