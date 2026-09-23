import styled, { css } from 'styled-components'
import { motion } from 'motion/react'
import type { LogKind } from './config'

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

export const ToggleRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`

export const Switch = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text);

  input {
    width: 18px;
    height: 18px;
    accent-color: var(--accent);
  }
`

export const Log = styled.div`
  flex: 1;
  min-height: 220px;
  max-height: 260px;
  overflow-y: auto;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--border);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: var(--mono);
  font-size: 12.5px;
`

const kindStyles: Record<LogKind, ReturnType<typeof css>> = {
  sub: css`
    border-color: rgba(97, 218, 251, 0.3);
    color: var(--accent);
  `,
  tick: css`
    border-color: rgba(192, 132, 252, 0.25);
    color: #d0b0ff;
  `,
  clean: css`
    border-color: rgba(124, 249, 194, 0.35);
    color: var(--accent-3);
  `,
  warn: css`
    border-color: rgba(255, 107, 122, 0.45);
    color: var(--danger);
    background: rgba(255, 107, 122, 0.06);
  `,
}

export const LogLine = styled(motion.div)<{ $kind: LogKind }>`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  display: flex;
  gap: 10px;
  align-items: center;
  ${({ $kind }) => kindStyles[$kind]}
`

export const LogTag = styled.span`
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.14em;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
`
