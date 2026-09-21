import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Volleyball() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Rebote suave
    meshRef.current.position.y = Math.sin(time * 2) * 0.3;
    meshRef.current.rotation.x = time * 0.5;
    meshRef.current.rotation.z = Math.sin(time) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={[4, -2, -3]}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial
        color="#fef08a"
        emissive="#facc15"
        emissiveIntensity={0.3}
      />
      {/* LÃ¬neas de la pelota de vÃ³ley */}
      <mesh>
        <torusGeometry args={[0.41, 0.02, 16, 32]} />
        <meshStandardMaterial color="#ca8a04" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.41, 0.02, 16, 32]} />
        <meshStandardMaterial color="#ca8a04" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.41, 0.02, 16, 32]} />
        <meshStandardMaterial color="#ca8a04" />
      </mesh>
    </mesh>
  );
}
