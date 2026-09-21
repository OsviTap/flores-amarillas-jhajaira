import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PetalProps {
  position: [number, number, number];
  rotationSpeed: number;
  fallSpeed: number;
  size: number;
  delay: number;
}

function createPetalShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.15, 0.3, 0.3, 0.6, 0.1, 1.0);
  shape.bezierCurveTo(0.0, 1.2, -0.0, 1.2, -0.1, 1.0);
  shape.bezierCurveTo(-0.3, 0.6, -0.15, 0.3, 0, 0);
  return shape;
}

export function Petal({ position, rotationSpeed, fallSpeed, size, delay }: PetalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = useMemo(() => position[1], [position]);
  const petalShape = useMemo(() => createPetalShape(), []);
  const wobbleOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const delayedTime = time - delay;

    const y = initialY - ((delayedTime * fallSpeed) % 25);
    const wobbleX = Math.sin(delayedTime * 2 + wobbleOffset) * 0.8;
    const wobbleZ = Math.cos(delayedTime * 1.5 + wobbleOffset) * 0.6;

    meshRef.current.position.y = y;
    meshRef.current.position.x = position[0] + Math.sin(delayedTime * 0.8 + wobbleOffset) * 1.5;
    meshRef.current.rotation.x = delayedTime * rotationSpeed * 0.3 + wobbleX;
    meshRef.current.rotation.y = delayedTime * rotationSpeed * 0.5;
    meshRef.current.rotation.z = delayedTime * rotationSpeed * 0.2 + wobbleZ;

    if (y < -12) {
      meshRef.current.position.y = initialY;
    }
  });

  const color = useMemo(() => {
    const colors = ['#fde047', '#facc15', '#fbbf24', '#f59e0b'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  return (
    <mesh ref={meshRef} position={position}>
      <extrudeGeometry args={[petalShape, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.02, bevelSegments: 3 }]} />
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
        roughness={0.4}
        metalness={0.05}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}
