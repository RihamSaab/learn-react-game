import styled from 'styled-components'
import { motion } from 'motion/react'

export const Palette = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 76px;
`

export const Chip = styled(motion.button)`
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  font-family: var(--mono);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  cursor: pointer;
  min-width: 140px;
`

export const ChipHint = styled.span`
  font-family: var(--sans);
  font-size: 11px;
  color: var(--text-dim);
`

export const Preview = styled.div`
  min-height: 180px;
  padding: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const PreviewEmpty = styled(motion.div)`
  color: var(--text-dim);
  font-size: 14px;
  text-align: center;
  margin: auto;
`

export const PreviewPiece = styled(motion.div)<{ $misplaced?: boolean }>`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid;
  background: rgba(0, 0, 0, 0.2);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  ${({ $misplaced }) =>
    $misplaced &&
    `
    border-color: rgba(255, 107, 122, 0.5) !important;
    box-shadow: 0 0 0 1px rgba(255, 107, 122, 0.25);
  `}
`

export const MockHeader = styled.div`
  font-weight: 600;
  color: var(--text-h);
  font-size: 1.05rem;
`

export const MockNav = styled.div`
  color: var(--text-dim);
  font-size: 0.9rem;
  letter-spacing: 0.04em;
`

export const MockCard = styled.div`
  color: var(--text);
  font-size: 0.95rem;
`

export const MockButton = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  background: var(--accent);
  color: #05101a;
  border: none;
  font-weight: 600;
`

export const MockFooter = styled.div`
  color: var(--text-dim);
  font-size: 0.85rem;
  text-align: center;
  font-family: var(--mono);
`

/**
 * Target hint shown next to the palette so the player knows what shape to
 * match without seeing the JSX answer.
 */
export const TargetHint = styled.div`
  margin-top: auto;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const TargetLabel = styled.span`
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
`

export const TargetMock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.25);
`

export const TargetHeaderMock = styled.div`
  padding: 10px 12px;
  border-radius: 6px 6px 2px 2px;
  background: rgba(97, 218, 251, 0.14);
  border-bottom: 2px solid rgba(97, 218, 251, 0.45);
  color: var(--text-h);
  font-weight: 600;
  font-size: 13px;
`

export const TargetCardMock = styled.div`
  padding: 14px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.16);
  color: var(--text-dim);
  font-family: var(--mono);
  font-size: 12px;
`

export const TargetButtonMock = styled.div`
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(124, 249, 194, 0.14);
  border: 1px solid rgba(124, 249, 194, 0.4);
  color: var(--text-h);
  font-size: 12px;
  font-weight: 600;
`

export const TinyLine = styled.p`
  font-size: 12px;
  color: var(--text-dim);
`
