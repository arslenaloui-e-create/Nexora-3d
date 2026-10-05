'use client';

import { Canvas } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';

function RealModel() {
  const { scene } = useGLTF('/models/baquebo.glb');

  return (
    <primitive
      object={scene}
      scale={0.18}
      position={[0, -0.5, 0]}
    />
  );
}

useGLTF.preload('/models/baquebo.glb');

function DemoPart() {
  return (
    <group rotation={[0.15, -0.35, 0]}>
      {/* Corps principal */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.8, 1.1, 1.8]} />
        <meshStandardMaterial
          color="#1b2733"
          metalness={0.82}
          roughness={0.24}
        />
      </mesh>

      {/* Partie supérieure */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.5, 1.25]} />
        <meshStandardMaterial
          color="#263746"
          metalness={0.88}
          roughness={0.2}
        />
      </mesh>

      {/* Axe central */}
      <mesh
        position={[0, 0.8, 0.68]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.28, 0.28, 0.22, 48]} />
        <meshStandardMaterial
          color="#20c4ff"
          metalness={0.9}
          roughness={0.18}
          emissive="#006d99"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Perçage gauche */}
      <mesh
        position={[-0.75, 0, 0.92]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.22, 0.22, 0.12, 40]} />
        <meshStandardMaterial
          color="#070b10"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Perçage droit */}
      <mesh
        position={[0.75, 0, 0.92]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.22, 0.22, 0.12, 40]} />
        <meshStandardMaterial
          color="#070b10"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Détails cyan */}
      <mesh position={[0, -0.57, 0]} castShadow>
        <boxGeometry args={[2.3, 0.06, 1.45]} />
        <meshStandardMaterial
          color="#00a9ff"
          metalness={0.65}
          roughness={0.3}
          emissive="#005b85"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

export default function Hero3DViewer() {
  return (
    <div className="hero-3d-viewer">
      <Canvas
        camera={{
          position: [7, 5, 9],
          fov: 42,
        }}
        dpr={[1, 1.5]}
        shadows
      >
        <ambientLight intensity={0.65} />

        <directionalLight
          position={[5, 6, 5]}
          intensity={2}
          castShadow
        />

        <pointLight
          position={[-4, 2, 3]}
          intensity={1.2}
          color="#20c4ff"
        />

        <RealModel />

        <ContactShadows
          position={[0, -0.65, 0]}
          opacity={0.35}
          scale={6}
          blur={2.5}
          far={4}
        />

        <Environment preset="city" />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={2}
          maxDistance={80}
          enableDamping
          dampingFactor={0.06}
          zoomSpeed={0.8}
        />
      </Canvas>

      <div className="hero-3d-hint">
        <span>↻</span>
        Faites glisser pour faire pivoter · Molette pour zoomer
      </div>
    </div>
  );
}