import { useState, type FormEvent } from 'react'
import { AnimatePresence } from 'motion/react'
import emailjs from '@emailjs/browser'
import {
  FinaleWrap,
  FormActions,
  FormCard,
  Intro,
  Textarea,
  ThanksNote,
  Title,
} from './styles'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function FinaleSection() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim() || status === 'sending') return

    setStatus('sending')
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { message },
        { publicKey: PUBLIC_KEY },
      )
      setStatus('sent')
      setMessage('')
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
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
          disabled={status === 'sending'}
        />
        <FormActions>
          <button
            type="submit"
            className="primary"
            disabled={!message.trim() || status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Send'}
          </button>
          <AnimatePresence>
            {status === 'sent' && (
              <ThanksNote
                key="thanks"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                Thanks, got it.
              </ThanksNote>
            )}
            {status === 'error' && (
              <ThanksNote
                key="error"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: 'var(--danger)' }}
              >
                Couldn't send. Try again.
              </ThanksNote>
            )}
          </AnimatePresence>
        </FormActions>
      </FormCard>
    </FinaleWrap>
  )
}
