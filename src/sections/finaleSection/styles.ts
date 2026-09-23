import styled from 'styled-components'
import { motion } from 'motion/react'

export const FinaleWrap = styled(motion.section)`
  padding: 60px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-top: 1px solid var(--border);
  margin: 60px auto 0;
  max-width: 720px;
`

export const Title = styled.h2`
  background: linear-gradient(120deg, #fff, var(--accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
`

export const Intro = styled.p`
  margin: 0;
  color: var(--text-dim);
  line-height: 1.5;
`

export const FormCard = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Textarea = styled.textarea`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.3);
  color: var(--text);
  font-family: var(--sans);
  font-size: 0.92rem;
  min-height: 100px;
  resize: vertical;

  &::placeholder { color: var(--text-dim); }
  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`

export const FormActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

export const ThanksNote = styled(motion.span)`
  color: var(--accent-3);
  font-size: 0.9rem;
`
