import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  label?: string
}

/**
 * Lightweight, hand-styled code block. Intentionally no syntax highlighter —
 * keeps the bundle small and consistent with the game's aesthetic.
 */
export function CodeBlock({ children, label }: Props) {
  return (
    <div className="code-block">
      {label && <div className="code-label">{label}</div>}
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  )
}
