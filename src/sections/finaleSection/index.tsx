import { useState, type FormEvent } from 'react'
import { AnimatePresence } from 'motion/react'
import {
  FinaleWrap,
  FormActions,
  FormCard,
  Intro,
  Textarea,
  ThanksNote,
  Title,
} from './styles'

export function FinaleSection() {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSent(true)
    setMessage('')
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <FinaleWrap
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <Title>You made it to the core.</Title>
      <Intro>
        Got a thought, a question, or a rule you think belongs here? Drop it below.
      </Intro>

      <FormCard onSubmit={submit}>
        <Textarea
          placeholder="Your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <FormActions>
          <button type="submit" className="primary" disabled={!message.trim()}>
            Send
          </button>
          <AnimatePresence>
            {sent && (
              <ThanksNote
                key="thanks"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                Thanks, got it.
              </ThanksNote>
            )}
          </AnimatePresence>
        </FormActions>
      </FormCard>
    </FinaleWrap>
  )
}
