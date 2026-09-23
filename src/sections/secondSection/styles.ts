import styled from 'styled-components'
import { motion } from 'motion/react'

/**
 * Goal indicator shown at the top of the props game — a chip in the target
 * colour so the player has an explicit target to match.
 */
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
  border: 1px solid;
  font-family: var(--mono);
  font-size: 12px;
  text-transform: lowercase;
  letter-spacing: 0.06em;
`

export const Swatches = styled.div`
  display: flex;
  gap: 8px;
`

export const Swatch = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.2s ease;

  &:hover { transform: scale(1.1); }

  ${({ $active }) =>
    $active &&
    `
    border-color: var(--text-h);
    transform: scale(1.15);
  `}
`

export const Chain = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const ChainNode = styled.div`
  display: grid;
  grid-template-columns: 90px 24px 1fr;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid var(--border);
`

export const ChainName = styled.div`
  font-family: var(--mono);
  color: var(--text-h);
  font-size: 0.92rem;
`

export const ChainSwatch = styled(motion.div)`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #333;
`
