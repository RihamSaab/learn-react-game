export const TIPS = [
  'Components are just functions that return JSX.',
  'Never mutate state directly, always use the setter.',
  'Props flow down, events flow up.',
  'Hooks must be called at the top level of your component.',
  'Keys help React tell items apart in a list.',
  'A component with no state can stay a plain function.',
  'Fragments (<>...</>) let you return siblings without a wrapper.',
  'Lifting state up means moving it to the closest common parent.',
  'useMemo caches values, useCallback caches functions.',
  'Refs hold values that survive re-renders but don\'t trigger them.',
]

/** How long the fake fetch takes to resolve, in ms. */
export const FETCH_DELAY_MS = 800

let lastTip: string | null = null

export function fakeFetchTip(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pool = lastTip ? TIPS.filter((t) => t !== lastTip) : TIPS
      const picked = pool[Math.floor(Math.random() * pool.length)]
      lastTip = picked
      resolve(picked)
    }, FETCH_DELAY_MS)
  })
}

export const codeSample = `useEffect(() => {
  setLoading(true)
  fetchTip().then((t) => {
    setTip(t)
    setLoading(false)
  })
}, [refreshKey])`
