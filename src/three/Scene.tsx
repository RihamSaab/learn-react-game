import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Sparkles, Stars } from '@react-three/drei'
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import { Suspense } from 'react'
import * as THREE from 'three'
import type { ScrollRef } from '../hooks/useScrollProgress'
import { Companion } from './Companion'

type Props = {
  scroll: ScrollRef
  pulse: ScrollRef
}

/**
 * Camera dolly. On scroll we descend a vertical road — Y drops from 0 to
 * -26 while Z stays roughly forward. Higher damping (softer response) makes
 * the descent feel smooth instead of snappy.
 */
function Rig({ scroll }: { scroll: ScrollRef }) {
  const { camera } = useThree()
  useFrame((_, dt) => {
    const p = scroll.current
    // -p * 30 lands the camera at each station's Y exactly at the midpoint
    // of that station's level section (see layout.ts STATION_YS).
    const targetY = -p * 30
    // Tiny forward push so distant stations approach subtly, not a pure lift.
    const targetZ = 7 - p * 3
    // Gentle horizontal drift as we descend — keeps the scene alive
    // without pushing the current station's planet off-frame at the
    // extreme scroll positions.
    const targetX = Math.sin(p * Math.PI * 2.5) * 0.5
    // Softer damping (lower coefficient = more lag = smoother feel).
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.2, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.4, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.4, dt)
    // Look mostly forward with a gentle downward tilt — enough for the
    // descent to feel like diving, small enough that station shapes at
    // camera-Y land near the vertical middle of the frame rather than
    // being pushed up over the level's heading.
    camera.lookAt(camera.position.x, camera.position.y - 0.5, camera.position.z - 5)
  })
  return null
}

function SceneContent({ scroll, pulse }: Props) {
  return (
    <>
      <color attach="background" args={['#04050c']} />
      <fog attach="fog" args={['#04050c', 12, 45]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 8, 5]} intensity={1.1} color="#ffffff" />
      <pointLight position={[10, 4, 10]} intensity={45} color="#61dafb" distance={30} />
      <pointLight position={[-10, -6, 8]} intensity={38} color="#c084fc" distance={30} />
      <pointLight position={[0, 4, -20]} intensity={30} color="#7cf9c2" distance={40} />

      <Environment preset="night" />
      <Stars radius={100} depth={80} count={4000} factor={3.2} fade speed={0.6} />

      {/* Two twinkling particle layers ride with the camera so they always
          feel like ambient dust drifting past — near ones larger/warmer, far
          ones smaller/cooler for depth. */}
      <Sparkles
        count={120}
        scale={[40, 60, 40]}
        size={3.5}
        speed={0.35}
        opacity={0.65}
        color="#a9c9ff"
      />
      <Sparkles
        count={60}
        scale={[18, 24, 18]}
        size={5}
        speed={0.7}
        opacity={0.5}
        color="#c084fc"
      />

      {/* Rigged robot companion with facial emotions */}
      <Suspense fallback={null}>
        <Companion scroll={scroll} pulse={pulse} />
      </Suspense>
    </>
  )
}

export function Scene({ scroll, pulse }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <SceneContent scroll={scroll} pulse={pulse} />
        <Rig scroll={scroll} />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.75}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.6}
            mipmapBlur
            kernelSize={KernelSize.LARGE}
          />
          <ChromaticAberration
            offset={[0.0004, 0.0006]}
            radialModulation={false}
            modulationOffset={0}
            blendFunction={BlendFunction.NORMAL}
          />
          <Vignette eskil={false} offset={0.2} darkness={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
