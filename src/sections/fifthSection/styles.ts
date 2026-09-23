import styled from 'styled-components'
import { motion } from 'motion/react'

type SlotKind = 'top' | 'bad'

export const HookEditor = styled.div`
  font-family: var(--mono);
  font-size: 13.5px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.4);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text);
`

export const HookLine = styled.div`
  color: var(--text-dim);
`

export const HookFn = styled.span`
  color: var(--accent-2);
`

export const HookSlot = styled.div<{ $kind: SlotKind }>`
  margin-left: 18px;
  padding: 12px;
  border-radius: 10px;
  border: 1px dashed var(--border-strong);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 60px;
  position: relative;

  ${({ $kind }) =>
    $kind === 'top'
      ? `
        border-color: rgba(124, 249, 194, 0.35);
        background: rgba(124, 249, 194, 0.04);
      `
      : `
        border-color: rgba(255, 107, 122, 0.35);
        background: rgba(255, 107, 122, 0.04);
      `}
`

export const SlotLabel = styled.span`
  position: absolute;
  top: -10px;
  left: 12px;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
  background: var(--bg-1);
  padding: 0 6px;
`

export const TinyLine = styled.span`
  font-size: 12px;
  color: var(--text-dim);
`

export const HookChip = styled(motion.div)<{ $kind: SlotKind }>`
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid;
  font-family: var(--mono);
  cursor: grab;
  user-select: none;

  &:active { cursor: grabbing; }

  ${({ $kind }) =>
    $kind === 'top'
      ? `
        border-color: rgba(124, 249, 194, 0.5);
        color: var(--accent-3);
        background: rgba(124, 249, 194, 0.06);
      `
      : `
        border-color: rgba(255, 107, 122, 0.5);
        color: var(--danger);
        background: rgba(255, 107, 122, 0.08);
      `}
`
