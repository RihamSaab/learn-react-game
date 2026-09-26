import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CodeBlock } from '../../ui/CodeBlock'
import { BehindScenes } from '../../ui/BehindScenes'
import { ORDER, PALETTE, PIECE_META, type Piece } from './config'
import {
  Chip,
  ChipHint,
  MockButton,
  MockCard,
  MockFooter,
  MockHeader,
  MockNav,
  Palette,
  Preview,
  PreviewEmpty,
  PreviewPiece,
  TargetButtonMock,
  TargetCardMock,
  TargetHeaderMock,
  TargetHint,
  TargetLabel,
  TargetMock,
  TinyLine,
} from './styles'

export function FirstSection() {
  const [placed, setPlaced] = useState<Piece[]>([])
  const remaining = PALETTE.filter((p) => !placed.includes(p))
  const correct =
    placed.length === ORDER.length && placed.every((p, i) => p === ORDER[i])
  const wrong = placed.length > 0 && placed.some((p, i) => p !== ORDER[i])

  const place = (p: Piece) => setPlaced((prev) => [...prev, p])
  const reset = () => setPlaced([])

  return (
    <>
      <div className="level-play right">
        <div className="grid two">
          <div className="panel">
            <h3>Palette</h3>
            <p className="dim">
              Tap pieces to compose the target on the right. Not everything belongs.
            </p>
            <Palette>
              <AnimatePresence mode="popLayout">
                {remaining.map((p) => (
                  <Chip
                    key={p}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => place(p)}
                    style={{ borderColor: PIECE_META[p].color, color: PIECE_META[p].color }}
                  >
                    {`<${p} />`}
                    <ChipHint>{PIECE_META[p].hint}</ChipHint>
                  </Chip>
                ))}
              </AnimatePresence>
              {remaining.length === 0 && <p className="dim">Palette empty. Reset to try again.</p>}
            </Palette>

            <TargetHint aria-label="Target composition">
              <TargetLabel>🎯 Target</TargetLabel>
              <TargetMock>
                <TargetHeaderMock aria-hidden>My App</TargetHeaderMock>
                <TargetCardMock aria-hidden>A card of content.</TargetCardMock>
                <TargetButtonMock aria-hidden>Click me</TargetButtonMock>
              </TargetMock>
              <TinyLine>
                A title bar on top, a card in the middle, a button at the bottom. Order matters!
              </TinyLine>
            </TargetHint>
          </div>

          <div className="panel">
            <h3>Preview</h3>
            <Preview>
              <AnimatePresence>
                {placed.length === 0 && (
                  <PreviewEmpty
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Empty. Add pieces →
                  </PreviewEmpty>
                )}
                {placed.map((p, i) => {
                  const expected = ORDER[i]
                  const misplaced = expected !== p
                  return (
                    <PreviewPiece
                      key={`${p}-${i}`}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      $misplaced={misplaced}
                      style={{ borderColor: PIECE_META[p].color }}
                    >
                      {p === 'Header' && <MockHeader>My App</MockHeader>}
                      {p === 'Nav' && <MockNav>Home · About · Blog</MockNav>}
                      {p === 'Card' && <MockCard>A card of content.</MockCard>}
                      {p === 'Button' && <MockButton>Click me</MockButton>}
                      {p === 'Footer' && <MockFooter>© 2026</MockFooter>}
                    </PreviewPiece>
                  )
                })}
              </AnimatePresence>
            </Preview>

            <div className="actions">
              <button onClick={reset} disabled={placed.length === 0}>Reset</button>
              {correct && (
                <motion.span
                  className="badge ok"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  ✓ Composed correctly
                </motion.span>
              )}
              {wrong && !correct && (
                <motion.span
                  className="badge bad"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  × doesn't match target. Reset and try again.
                </motion.span>
              )}
            </div>

            {correct && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <CodeBlock label="You composed">
{`function App() {
  return (
    <>
      <Header />
      <Card />
      <Button />
    </>
  )
}`}
                </CodeBlock>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <BehindScenes
        analogy={
          <>
            Think of components as <strong>Lego bricks</strong>. Each brick is a small,
            reusable piece. You build any app (a website, a dashboard, a game) by
            snapping the same few brick types together in different arrangements.
          </>
        }
        steps={[
          {
            label: 'A component is just a function',
            text: (
              <>
                When you write <code>&lt;Header /&gt;</code>, React calls a function named{' '}
                <code>Header</code> and asks it: "what should be on the screen?"
              </>
            ),
          },
          {
            label: 'It returns a description of UI',
            text: (
              <>
                The function returns JSX, a lightweight description of elements, not real
                DOM. React reads that description.
              </>
            ),
          },
          {
            label: 'React builds and updates the real page',
            text: (
              <>
                React compares the new description with the previous one and updates only
                what changed. That's why apps built this way feel snappy.
              </>
            ),
          },
        ]}
      />
    </>
  )
}
