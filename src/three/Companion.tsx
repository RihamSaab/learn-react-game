import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import type { Group, Object3D } from 'three'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import type { ScrollRef } from '../hooks/useScrollProgress'
import { nearestStationSide, useResponsiveFactor } from './layout'

const ROBOT_URL = '/models/robot_playground/scene.gltf'

useGLTF.preload(ROBOT_URL)

/** Face-mesh names per expression — swapping visibility drives emotions. */
const EMOTIONS = {
  neutral:   new Set(['eye', 'eye1', 'close']),
  blink:     new Set(['eyeClose', 'eyeClose1', 'close']),
  happy:     new Set(['eyeSmile', 'eyeSmile1', 'smile']),
  bliss:     new Set(['eyeCloseKawaii', 'eyeCloseKawaii1', 'happy']),
  surprised: new Set(['eye', 'eye1', 'o']),
} as const

type EmotionKey = keyof typeof EMOTIONS

const ALL_FACE_NODES = [
  'eye', 'eyeClose', 'eyeSmile', 'eyeCloseKawaii',
  'eye1', 'eyeClose1', 'eyeSmile1', 'eyeCloseKawaii1',
  'close', 'smile', 'happy', 'o',
]

// ---- Layout tuning -----------------------------------------------------------

/** Side-companion scale used from Level 1 onward. */
const ROBOT_SCALE = 0.7
/** Hero scale — larger, centered, front-facing "poster" pose on the intro. */
const HERO_SCALE = 1.35
/** How far from the camera the robot floats (world units) in the horizontal
 *  axis at desktop widths. Multiplied by the responsive factor at render time. */
const X_OFFSET = 3.6
/** Vertical offset from the camera. The skinned rig's bind pose renders the
 *  visible body a couple of units above the mesh anchor, so a negative Y
 *  here lands the robot roughly at the camera's eye line (alongside text). */
const Y_OFFSET = -2.2
/** Hero vertical offset — sit closer to viewport center so the enlarged robot
 *  reads as a poster, not a low corner mascot. */
const HERO_Y_OFFSET = -1.4
/** Hero horizontal shift — nudge right of dead-centre so the enlarged body
 *  clears the "Learn React with me" heading on the left. Scaled by the
 *  responsive factor so it doesn't push off narrow viewports. */
const HERO_X_OFFSET = 2.0
/** Distance in front of the camera. */
const Z_OFFSET = -4.5
/** Hero Z — a touch further back so the enlarged scale doesn't clip the near plane. */
const HERO_Z_OFFSET = -5.2

// ---- Types + props -----------------------------------------------------------

type Props = {
  scroll: ScrollRef
  pulse: ScrollRef
}

// -----------------------------------------------------------------------------

function Robot({
  scroll,
  pulse,
  rigRef,
}: Props & { rigRef: RefObject<Group | null> }) {
  const gltf = useGLTF(ROBOT_URL)
  // SkeletonUtils.clone gives us an independent SkinnedMesh + skeleton — a
  // plain Object3D.clone() would share references, and parent-group
  // translations would not visibly move the mesh.
  const scene = useMemo(() => SkeletonUtils.clone(gltf.scene) as Group, [gltf.scene])
  const anims = useAnimations(gltf.animations, scene)
  const rig = rigRef
  const xFactor = useResponsiveFactor()


  // Re-anchor the model so its visible bounding-box centre sits on the
  // group's origin. The Robot Playground GLB's root is offset from the
  // rendered body, which pushes it off-centre in hero mode where we place
  // the group directly on the camera's X axis.
  const primitiveOffset = useMemo(() => {
    scene.updateWorldMatrix(true, true)
    const box = new THREE.Box3().setFromObject(scene)
    const centre = box.getCenter(new THREE.Vector3())
    // Only re-centre on X and Z — the Y offset was already tuned against the
    // model's rigged bind pose (see Y_OFFSET / HERO_Y_OFFSET above).
    return new THREE.Vector3(-centre.x, 0, -centre.z)
  }, [scene])

  // Play every animation clip the GLB ships with — the Robot Playground
  // model layers idle body moves, prop rotations, and platform pulses across
  // separate clips, so playing them all together gives the "on" look.
  useEffect(() => {
    const actions = Object.values(anims.actions).filter(
      (a): a is NonNullable<typeof a> => a != null,
    )
    actions.forEach((a) => {
      a.reset()
        .setEffectiveTimeScale(0.6)
        .setLoop(THREE.LoopRepeat, Infinity)
        .play()
    })
    return () => {
      actions.forEach((a) => a.fadeOut(0.3))
    }
  }, [anims])

  // Cache the face-mesh nodes so we can flip visibility cheaply per frame.
  const faceNodes = useMemo(() => {
    const map = new Map<string, Object3D>()
    ALL_FACE_NODES.forEach((name) => {
      const node = scene.getObjectByName(name)
      if (node) map.set(name, node)
    })
    return map
  }, [scene])

  const emotion = useRef<EmotionKey>('neutral')
  const emotionUntil = useRef(0)
  const lastMilestone = useRef(-1)
  const currentSide = useRef(1)

  const applyEmotion = (key: EmotionKey) => {
    const active = EMOTIONS[key]
    faceNodes.forEach((node, name) => { node.visible = active.has(name) })
  }

  useEffect(() => {
    applyEmotion('neutral')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceNodes])

  useFrame((state, dt) => {
    const g = rig.current
    if (!g) return
    const cam = state.camera
    const t = state.clock.elapsedTime

    // Hero factor: 1 at the top of the page (poster pose, centered, front-
    // facing, larger) → 0 once we've scrolled ~half-way to Level 1, where the
    // side-companion behaviour takes over. Driven by camera-Y so it stays in
    // sync with the dolly regardless of scroll units.
    const heroFactor = 1 - THREE.MathUtils.smoothstep(-cam.position.y, 0.5, 2.5)

    // --- Position: opposite side of whichever station the camera is nearest.
    const targetSide = -nearestStationSide(cam.position.y)
    currentSide.current = THREE.MathUtils.damp(currentSide.current, targetSide, 2.5, dt)

    const sideX = currentSide.current * X_OFFSET * xFactor
    const heroX = HERO_X_OFFSET * xFactor
    const targetX =
      cam.position.x + THREE.MathUtils.lerp(sideX, heroX, heroFactor)
    const targetY =
      cam.position.y +
      THREE.MathUtils.lerp(Y_OFFSET, HERO_Y_OFFSET, heroFactor) +
      Math.sin(t * 1.1) * 0.15
    const targetZ = cam.position.z + THREE.MathUtils.lerp(Z_OFFSET, HERO_Z_OFFSET, heroFactor)
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, 2.2, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 2.4, dt)
    g.position.z = THREE.MathUtils.damp(g.position.z, targetZ, 2.4, dt)

    // Scale — enlarge for the hero, shrink to companion once scroll begins.
    const targetScale = THREE.MathUtils.lerp(ROBOT_SCALE, HERO_SCALE, heroFactor)
    const nextScale = THREE.MathUtils.damp(g.scale.x, targetScale, 3, dt)
    g.scale.setScalar(nextScale)

    // Rotation: in hero mode face the camera straight-on (rot.y = 0, plus a
    // small idle sway). Off-hero, face slightly inward from whichever side.
    const idleSway = Math.sin(t * 0.4) * 0.1
    const heroRot = idleSway
    const sideRot = -currentSide.current * 0.4 + idleSway
    g.rotation.y = THREE.MathUtils.damp(
      g.rotation.y,
      THREE.MathUtils.lerp(sideRot, heroRot, heroFactor),
      1.8,
      dt,
    )

    // --- Emotion state machine ---
    if (pulse.current > 0.15 && emotion.current !== 'surprised') {
      emotion.current = 'surprised'
      emotionUntil.current = t + 0.6
      applyEmotion('surprised')
    }
    const milestone = Math.floor(scroll.current * 5)
    if (milestone !== lastMilestone.current) {
      lastMilestone.current = milestone
      if (milestone > 0 && t > emotionUntil.current - 0.2) {
        const next: EmotionKey = milestone >= 5 ? 'bliss' : 'happy'
        emotion.current = next
        emotionUntil.current = t + (milestone >= 5 ? 4 : 1.4)
        applyEmotion(next)
      }
    }
    if (t > emotionUntil.current) {
      const isBlink = (t % 4) < 0.14
      const desired: EmotionKey = isBlink ? 'blink' : 'neutral'
      if (emotion.current !== desired) {
        emotion.current = desired
        applyEmotion(desired)
      }
    }
  })

  return (
    <group ref={rig} scale={ROBOT_SCALE}>
      <pointLight position={[1.5, 1, 2]} intensity={10} color="#61dafb" distance={7} />
      <pointLight position={[-1, -0.5, 1.5]} intensity={6} color="#c084fc" distance={6} />
      <primitive object={scene} position={primitiveOffset} />
    </group>
  )
}

export function Companion({ scroll, pulse }: Props) {
  const rigRef = useRef<Group>(null)
  return <Robot scroll={scroll} pulse={pulse} rigRef={rigRef} />
}
