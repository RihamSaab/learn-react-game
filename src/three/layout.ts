import { useThree } from '@react-three/fiber'

/**
 * Shared layout constants for the 3D scene — one source of truth for
 * station Y positions, the road's total depth, and mobile scaling.
 *
 * Stations sit at these Y values and alternate x-side (see xSideFor). The
 * camera dolly (Scene.tsx) descends past all of them; the companion robot
 * follows on the opposite side (see Companion.tsx).
 */

/**
 * One station per level, positioned so the camera dolly lands on each
 * station Y exactly at that level's scroll midpoint. Empirically measured
 * midpoint scroll-progress values (see useScrollProgress) are ~0.154,
 * 0.325, 0.494, 0.667, 0.849 — so with a dolly rate of `-p * 30` the
 * matching station Ys are −5, −10, −15, −20, −25.
 */
export const STATION_YS = [-5, -10, -15, -20, -25] as const

/**
 * X-side sign per station index — left, right, left, right, left.
 * Station 0 (Components) sits on the *left* so the robot naturally lands
 * on the *right* at the hero (and stays there through Level 1), clear
 * of the fixed ProgressRail on the far left of the viewport.
 */
export function xSideFor(index: number): 1 | -1 {
  return index % 2 === 0 ? -1 : 1
}

/** Sign of the station nearest to the given camera Y (as its authored side). */
export function nearestStationSide(camY: number): 1 | -1 {
  // Above the first → mirror the first station.
  if (camY > STATION_YS[0]) return xSideFor(0)
  // Below the last → mirror the last station.
  if (camY < STATION_YS[STATION_YS.length - 1]) return xSideFor(STATION_YS.length - 1)
  let bestIdx = 0
  let bestDist = Infinity
  for (let i = 0; i < STATION_YS.length; i++) {
    const d = Math.abs(camY - STATION_YS[i])
    if (d < bestDist) { bestDist = d; bestIdx = i }
  }
  return xSideFor(bestIdx)
}

/**
 * Responsive width factor 0..1 based on canvas pixel width. 1 at desktop
 * widths (≥1200px), scales down on tablets and phones so world-space X
 * offsets don't push planets and the robot off the sides of narrow screens.
 */
export function useResponsiveFactor(): number {
  const width = useThree((s) => s.size.width)
  return Math.min(1, Math.max(0.35, width / 1200))
}
