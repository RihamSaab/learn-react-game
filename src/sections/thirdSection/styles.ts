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

export const CounterBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

export const CounterValue = styled(motion.div)`
  font-family: var(--mono);
  font-size: 3rem;
  color: var(--text-h);
  min-width: 3ch;
  text-align: center;
  line-height: 1;
`

export const StatList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 22px;
  color: var(--text-dim);
  font-size: 14px;

  strong {
    color: var(--text-h);
    font-weight: 600;
  }
`
