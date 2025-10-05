import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import './App.css'
import { Suspense } from 'react'
import { Controls } from './components/Controls'
import { Results } from './components/Results'
import { NEOButton } from './components/NEOButton'
import { NEOList } from './components/NEOList'

function Earth() {
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#2e86de" roughness={0.9} metalness={0.0} />
    </mesh>
  )
}

function Asteroid() {
  return (
    <mesh position={[3, 1, 0]}> 
      <icosahedronGeometry args={[0.2, 1]} />
      <meshStandardMaterial color="#8d6e63" roughness={1} />
    </mesh>
  )
}

export default function App() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#000', position: 'relative' }}>
      <Controls />
      <NEOButton />
      <NEOList />
      <Results />
      <Canvas camera={{ position: [4, 2, 4], fov: 50 }}>
        <color attach="background" args={[0, 0, 0]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.0} />
        <Suspense fallback={null}>
          <group>
            <Earth />
            <Asteroid />
          </group>
          <Stars radius={50} depth={20} count={1000} factor={2} saturation={0} fade />
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  )
}
