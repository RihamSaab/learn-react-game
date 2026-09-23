export type Slot = 'top' | 'inside-if'

export type HookCall = { id: string; label: string; slot: Slot }

export const INITIAL_HOOKS: HookCall[] = [
  { id: 'a', label: 'useState(0)', slot: 'top' },
  { id: 'b', label: 'useEffect(...)', slot: 'top' },
  { id: 'c', label: 'useMemo(...)', slot: 'top' },
]

export const RULE_CODE = `// ✓ Always call hooks at the top of the component.
// ✗ Never call hooks inside if / loops / early return.`
