export const COLORS = ['#61dafb', '#c084fc', '#7cf9c2', '#ffd166', '#ff6b7a'] as const
export type Color = (typeof COLORS)[number]

export const NAMES: Record<string, string> = {
  '#61dafb': 'cyan',
  '#c084fc': 'purple',
  '#7cf9c2': 'mint',
  '#ffd166': 'gold',
  '#ff6b7a': 'coral',
}

export const CHAIN_NODES = ['Parent', 'Child', 'GrandChild'] as const

export const pickDifferent = (current: string) => {
  const others = COLORS.filter((c) => c !== current)
  return others[Math.floor(Math.random() * others.length)]
}
