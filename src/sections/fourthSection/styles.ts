import styled from 'styled-components'
import { motion } from 'motion/react'

export const Goal = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.92rem;
  color: var(--text);
  flex-wrap: wrap;
`

export const GoalLabel = styled.span`
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
`

export const GoalChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--accent-3);
  color: var(--accent-3);
  background: rgba(124, 249, 194, 0.08);
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.06em;
`

export const TipCard = styled.div`
  min-height: 220px;
  padding: 26px 24px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(97, 218, 251, 0.08), rgba(192, 132, 252, 0.08));
  border: 1px solid rgba(97, 218, 251, 0.25);
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
`

export const TipLabel = styled.span`
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
`

export const TipQuote = styled(motion.blockquote)`
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.5;
  color: var(--text);
  font-weight: 500;
`

export const SpinnerWrap = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: var(--text-dim);
  font-size: 0.9rem;
`

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid rgba(97, 218, 251, 0.2);
  border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`
