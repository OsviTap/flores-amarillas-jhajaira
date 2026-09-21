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

export function Petal({ position, rotationSpeed, fallSpeed, size, delay }: PetalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = useMemo(() => position[1], [position]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const delayedTime = time - delay;

    // CaÃ±da con rotaciÃ³n
    const y = initialY - (delayedTime * fallSpeed) % 25;
    const rotationX = delayedTime * rotationSpeed;
    const rotationZ = delayedTime * rotationSpeed * 0.5;

    meshRef.current.position.y = y;
    meshRef.current.rotation.x = rotationX;
    meshRef.current.rotation.z = rotationZ;

    // Reset cuando sale de pantalla
    if (y < -12) {
      meshRef.current.position.y = initialY;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size, size * 1.5]} />
      <meshStandardMaterial
        color="#facc15"
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
