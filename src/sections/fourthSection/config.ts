export type LogKind = 'sub' | 'tick' | 'clean' | 'warn'

export type LogEntry = { id: number; text: string; kind: LogKind }

/** How often the mounted subscriber "receives" a tick from the fake server. */
export const TICK_MS = 900

/** Max entries kept in the log before oldest is dropped. */
export const LOG_MAX = 10

export const codeFor = (cleanup: boolean) => `useEffect(() => {
  const t = setInterval(tick, 900)
  ${cleanup ? 'return () => clearInterval(t) // ✓' : '// no cleanup, leaks ✗'}
}, [])`
