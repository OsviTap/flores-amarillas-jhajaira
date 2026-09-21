import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Flower3DProps {
  isBlooming: boolean;
}

export function Flower3D({ isBlooming }: Flower3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const petalsRef = useRef<THREE.Mesh[]>([]);
  const [bloomProgress, setBloomProgress] = useState(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Progreso de floraciÃ³n
    const targetProgress = isBlooming ? 1 : 0;
    const newProgress = THREE.MathUtils.lerp(bloomProgress, targetProgress, delta * 2);
    setBloomProgress(newProgress);

    // RotaciÃ³n suave del grupo
    groupRef.current.rotation.y += delta * 0.2;

    // Animar pÃ©talos
    petalsRef.current.forEach((petal, index) => {
      if (!petal) return;

      const angle = (index / 8) * Math.PI * 2;
      const bloomAngle = newProgress * Math.PI * 0.4;
      const scale = 0.3 + newProgress * 0.7;

      petal.rotation.x = bloomAngle;
      petal.rotation.z = angle;
      petal.scale.setScalar(scale);
      petal.position.y = newProgress * 0.5;
    });
  });

  const petalColors = ['#fde047', '#facc15', '#eab308', '#fde047', '#facc15', '#eab308', '#fde047', '#facc15'];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Centro de la flor */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#ca8a04" emissive="#facc15" emissiveIntensity={0.5} />
      </mesh>

      {/* PÃ©talos */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) petalsRef.current[i] = el; }}
          position={[0, 0, 0]}
        >
          <capsuleGeometry args={[0.15, 1.5, 8, 16]} />
          <meshStandardMaterial
            color={petalColors[i]}
            emissive="#facc15"
            emissiveIntensity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Tallo */}
      <mesh position={[0, -2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 3, 16]} />
        <meshStandardMaterial color="#166534" />
      </mesh>

      {/* Hojas */}
      <mesh position={[0.3, -1, 0.2]} rotation={[0.3, 0, 0.5]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      <mesh position={[-0.3, -0.8, -0.2]} rotation={[-0.2, 0, -0.5]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
    </group>
  );
}
