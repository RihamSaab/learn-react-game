import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type ReactElement } from 'react'
import * as THREE from 'three'
import type { Group, Mesh, MeshStandardMaterial, PointLight } from 'three'
import type { ScrollRef } from '../hooks/useScrollProgress'
import { STATION_YS, useResponsiveFactor, xSideFor } from './layout'

type ShapeProps = { color: string; stationY: number }

export type StationKind = 'blocks' | 'flow' | 'core' | 'gyro' | 'stack'

export const STATION_COLORS: Record<StationKind, string> = {
  blocks: '#61dafb',
  flow: '#c084fc',
  core: '#7cf9c2',
  gyro: '#ff6b7a',
  stack: '#ffd166',
}

type StationDef = {
  y: number
  xBase: number
  z: number
  color: string
  kind: StationKind
  label: string
}

/**
 * Horizontal offset of each station's centre from the world axis (world
 * units). Pulled in so the planet sits just beside the centered game
 * column — part of one composition rather than exiled to the viewport edge.
 */
const X_MAGNITUDE = 2.4

/**
 * Peak scale each station grows to when the camera is at its Y. Bumped past
 * 1 so the planet dominates its section, not the game panel.
 */
const STATION_MAX_SCALE = 1.9

const STATIONS: StationDef[] = STATION_YS.map((y, i) => {
  const themes: Array<Omit<StationDef, 'y' | 'xBase' | 'z'>> = [
    { color: '#61dafb', kind: 'blocks', label: 'Components' },
    { color: '#c084fc', kind: 'flow', label: 'Props' },
    { color: '#7cf9c2', kind: 'core', label: 'State' },
    { color: '#ff6b7a', kind: 'gyro', label: 'Effects' },
    { color: '#ffd166', kind: 'stack', label: 'Rules of Hooks' },
  ]
  return { y, z: -5.5, xBase: xSideFor(i) * X_MAGNITUDE, ...themes[i] }
})

/**
 * Level 1 planet — scroll-driven puzzle. Six cubes start scattered around
 * the station; as the camera descends toward this level's Y, each piece
 * eases into its final slot and assembles into a small house (floor, walls,
 * two-slope roof, door, chimney). The animation reverses on scroll-out so
 * the "components composing" idea plays every time the user passes.
 */
export function Blocks({ color, stationY }: ShapeProps) {
  const groupRef = useRef<Group>(null)
  const pieceRefs = useRef<Array<Group | null>>([])

  const pieces = useMemo(
    () => [
      // Floor slab.
      {
        size: [1.9, 0.18, 1.3] as const,
        finalPos: [0, -0.85, 0] as const,
        finalRot: [0, 0, 0] as const,
        startOffset: [-4, -1.5, 2] as const,
        startRot: [Math.PI * 0.5, Math.PI * 0.3, 0] as const,
        delay: 0,
        emissive: 0.4,
      },
      // Main body / walls.
      {
        size: [1.5, 0.9, 1.15] as const,
        finalPos: [0, -0.28, 0] as const,
        finalRot: [0, 0, 0] as const,
        startOffset: [4, 1.2, 1.8] as const,
        startRot: [Math.PI * 0.4, Math.PI * -0.5, 0] as const,
        delay: 0.14,
        emissive: 0.55,
      },
      // Door on the front face.
      {
        size: [0.32, 0.5, 0.06] as const,
        finalPos: [0, -0.52, 0.61] as const,
        finalRot: [0, 0, 0] as const,
        startOffset: [0, -3, 2.5] as const,
        startRot: [Math.PI * 0.5, 0, Math.PI * 0.3] as const,
        delay: 0.28,
        emissive: 1.4,
      },
      // Roof — left slope.
      {
        size: [1.1, 0.15, 1.25] as const,
        finalPos: [-0.36, 0.5, 0] as const,
        finalRot: [0, 0, Math.PI / 5] as const,
        startOffset: [-3.5, 3.5, 1.5] as const,
        startRot: [Math.PI * 0.3, Math.PI * 0.4, 0] as const,
        delay: 0.4,
        emissive: 0.7,
      },
      // Roof — right slope.
      {
        size: [1.1, 0.15, 1.25] as const,
        finalPos: [0.36, 0.5, 0] as const,
        finalRot: [0, 0, -Math.PI / 5] as const,
        startOffset: [3.5, 3.5, 1.5] as const,
        startRot: [Math.PI * -0.3, Math.PI * -0.4, 0] as const,
        delay: 0.4,
        emissive: 0.7,
      },
      // Chimney.
      {
        size: [0.18, 0.4, 0.18] as const,
        finalPos: [0.42, 0.9, 0] as const,
        finalRot: [0, 0, 0] as const,
        startOffset: [0, 4, 2] as const,
        startRot: [Math.PI * 0.5, Math.PI * 0.3, 0] as const,
        delay: 0.55,
        emissive: 0.9,
      },
    ],
    [],
  )

  useFrame((state, dt) => {
    if (groupRef.current) {
      // Slow ambient yaw so the assembled house catches light from different
      // angles without spinning fast enough to feel gimmicky.
      groupRef.current.rotation.y += dt * 0.08
    }

    // 0 when far away, 1 when the camera is right at this station's Y.
    const camY = state.camera.position.y
    const dist = Math.abs(camY - stationY)
    const progress = 1 - THREE.MathUtils.smoothstep(dist, 0.4, 5)

    pieces.forEach((piece, i) => {
      const ref = pieceRefs.current[i]
      if (!ref) return
      // Per-piece stagger + easeOutCubic — later pieces snap in after
      // earlier ones so the assembly reads as a sequence, not a smash cut.
      const local = THREE.MathUtils.clamp((progress - piece.delay) / 0.5, 0, 1)
      const eased = 1 - Math.pow(1 - local, 3)

      ref.position.x = THREE.MathUtils.lerp(
        piece.finalPos[0] + piece.startOffset[0],
        piece.finalPos[0],
        eased,
      )
      ref.position.y = THREE.MathUtils.lerp(
        piece.finalPos[1] + piece.startOffset[1],
        piece.finalPos[1],
        eased,
      )
      ref.position.z = THREE.MathUtils.lerp(
        piece.finalPos[2] + piece.startOffset[2],
        piece.finalPos[2],
        eased,
      )
      ref.rotation.x = THREE.MathUtils.lerp(piece.startRot[0], piece.finalRot[0], eased)
      ref.rotation.y = THREE.MathUtils.lerp(piece.startRot[1], piece.finalRot[1], eased)
      ref.rotation.z = THREE.MathUtils.lerp(piece.startRot[2], piece.finalRot[2], eased)
    })
  })

  return (
    <group ref={groupRef}>
      {pieces.map((piece, i) => (
        <group
          key={i}
          ref={(el) => {
            pieceRefs.current[i] = el
          }}
        >
          <mesh>
            <boxGeometry args={[piece.size[0], piece.size[1], piece.size[2]]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={piece.emissive}
              roughness={0.3}
              metalness={0.45}
              toneMapped={false}
              transparent
              opacity={0.92}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function Flow({ color }: ShapeProps) {
  const group = useRef<Group>(null)
  const parent = useRef<Mesh>(null)
  const childA = useRef<Group>(null)
  const childB = useRef<Group>(null)
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.y = Math.sin(t * 0.4) * 0.3
    if (parent.current) {
      const mat = parent.current.material as MeshStandardMaterial
      mat.emissiveIntensity = 1.0 + Math.sin(t * 1.4) * 0.3
    }
    if (childA.current) childA.current.rotation.y = t * 0.9
    if (childB.current) childB.current.rotation.z = t * -0.7
  })
  return (
    <group ref={group}>
      <mesh ref={parent}>
        <sphereGeometry args={[0.9, 40, 40]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.1}
          roughness={0.35}
          toneMapped={false}
        />
      </mesh>
      <group ref={childA} rotation={[0.4, 0, 0]}>
        <mesh position={[1.6, 0, 0]}>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      </group>
      <group ref={childB} rotation={[0, 0, 0.6]}>
        <mesh position={[2.0, 0.2, 0]}>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

export function Core({ color }: ShapeProps) {
  const inner = useRef<Mesh>(null)
  const ringA = useRef<Mesh>(null)
  const ringB = useRef<Mesh>(null)
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (inner.current) {
      const s = 1 + Math.sin(t * 1.6) * 0.08
      inner.current.scale.setScalar(s)
      const mat = inner.current.material as MeshStandardMaterial
      mat.emissiveIntensity = 1.5 + Math.sin(t * 1.6) * 0.7
    }
    if (ringA.current) ringA.current.rotation.z += dt * 0.6
    if (ringB.current) {
      ringB.current.rotation.x += dt * 0.4
      ringB.current.rotation.y += dt * 0.2
    }
  })
  return (
    <group>
      <mesh ref={inner}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.6}
          roughness={0.15}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.035, 16, 96]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.9}
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={ringB} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[1.45, 0.025, 16, 96]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export function Gyro({ color }: ShapeProps) {
  const r0 = useRef<Mesh>(null)
  const r1 = useRef<Mesh>(null)
  const r2 = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (r0.current) r0.current.rotation.x += dt * 0.9
    if (r1.current) r1.current.rotation.y += dt * 0.7
    if (r2.current) r2.current.rotation.z += dt * 1.1
  })
  return (
    <group>
      <mesh ref={r0}>
        <torusGeometry args={[1.05, 0.045, 16, 96]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} toneMapped={false} />
      </mesh>
      <mesh ref={r1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.045, 16, 96]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[1.2, 0.035, 16, 96]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
    </group>
  )
}

export function Stack({ color }: ShapeProps) {
  const group = useRef<Group>(null)
  useFrame((_, dt) => {
    if (!group.current) return
    group.current.rotation.y += dt * 0.3
  })
  const layers = [0, 1, 2, 3, 4]
  return (
    <group ref={group}>
      {layers.map((i) => {
        const y = i * 0.36 - 0.72
        const size = 0.95 - i * 0.1
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[0, i * 0.15, 0]}>
            <cylinderGeometry args={[size, size, 0.18, 6]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6 + i * 0.2}
              roughness={0.25}
              metalness={0.4}
              transparent
              opacity={0.88}
              toneMapped={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export const SHAPES: Record<StationKind, (p: ShapeProps) => ReactElement> = {
  blocks: Blocks,
  flow: Flow,
  core: Core,
  gyro: Gyro,
  stack: Stack,
}

function Station({ def, xFactor }: { def: StationDef; xFactor: number }) {
  const group = useRef<Group>(null)
  const light = useRef<PointLight>(null)
  const Shape = SHAPES[def.kind]
  const x = def.xBase * xFactor

  useFrame((state, dt) => {
    if (!group.current) return
    const camY = state.camera.position.y
    const dist = Math.abs(camY - def.y)
    const proximity = Math.max(0, 1 - dist / 4)

    const proximityRamp = 1 - THREE.MathUtils.smoothstep(dist, 1, 3.5)
    const targetScale = proximityRamp * STATION_MAX_SCALE
    const nextScale = THREE.MathUtils.damp(group.current.scale.x, targetScale, 5, dt)
    group.current.scale.setScalar(nextScale)
    group.current.visible = nextScale > 0.01

    group.current.position.y = def.y + Math.sin(state.clock.elapsedTime * 0.6 + def.y) * 0.15
    if (light.current) {
      light.current.intensity = THREE.MathUtils.damp(
        light.current.intensity,
        4 + proximity * 22,
        4,
        dt,
      )
    }
  })

  return (
    <group ref={group} position={[x, def.y, def.z]} scale={0}>
      <pointLight ref={light} color={def.color} intensity={4} distance={14} />
      <Shape color={def.color} stationY={def.y} />
    </group>
  )
}

type Props = { scroll: ScrollRef }

export function Stations({ scroll }: Props) {
  void scroll
  const xFactor = useResponsiveFactor()
  return useMemo(
    () => (
      <>
        {STATIONS.map((s) => (
          <Station key={s.label} def={s} xFactor={xFactor} />
        ))}
      </>
    ),
    [xFactor],
  )
}
