import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Flower3DProps { isBlooming: boolean }
type V3 = [number, number, number];
type Flower = { position: V3; rotation: V3; scale: number; delay: number };

const TIE = new THREE.Vector3(0, -1.18, -0.12);
const UP = new THREE.Vector3(0, 1, 0);
const random = (n: number) => {
  const value = Math.sin(n * 91.731 + 17.19) * 43758.5453;
  return value - Math.floor(value);
};

function createPetalGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.1, 0.08, 0.18, 0.34, 0.15, 0.62);
  shape.bezierCurveTo(0.13, 0.82, 0.055, 0.98, 0, 1.08);
  shape.bezierCurveTo(-0.055, 0.98, -0.13, 0.82, -0.15, 0.62);
  shape.bezierCurveTo(-0.18, 0.34, -0.1, 0.08, 0, 0);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.022, bevelEnabled: true, bevelThickness: 0.009,
    bevelSize: 0.012, bevelSegments: 2, curveSegments: 12,
  });
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i += 1) {
    const y = positions.getY(i);
    positions.setZ(i, positions.getZ(i) + Math.sin(Math.min(y, 1) * Math.PI) * 0.055);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function createLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.2, 0.16, 0.27, 0.55, 0, 0.92);
  shape.bezierCurveTo(-0.27, 0.55, -0.2, 0.16, 0, 0);
  return new THREE.ShapeGeometry(shape, 12);
}

function CylinderBetween({ from, to, radius = 0.017 }: {
  from: THREE.Vector3; to: THREE.Vector3; radius?: number;
}) {
  const transform = useMemo(() => {
    const direction = to.clone().sub(from);
    return {
      length: direction.length(),
      midpoint: from.clone().add(to).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(UP, direction.normalize()),
    };
  }, [from, to]);
  return (
    <mesh position={transform.midpoint} quaternion={transform.quaternion}>
      <cylinderGeometry args={[radius, radius * 1.12, transform.length, 8]} />
      <meshStandardMaterial color="#285a35" roughness={0.84} />
    </mesh>
  );
}

function Stem({ flower, index }: { flower: Flower; index: number }) {
  const end = useMemo(() => new THREE.Vector3(...flower.position).add(new THREE.Vector3(0, -0.08, -0.08)), [flower]);
  const leafGeometry = useMemo(() => createLeafGeometry(), []);
  const side = index % 2 === 0 ? -1 : 1;
  return (
    <group>
      <CylinderBetween from={TIE} to={end} radius={0.014 + random(index + 4) * 0.006} />
      <mesh
        geometry={leafGeometry}
        position={[flower.position[0] * 0.4 + side * 0.08, -0.72 + random(index) * 0.58, flower.position[2]]}
        rotation={[0.12, side * 0.35, side * -0.92]}
        scale={[0.28, 0.42, 0.28]}
      >
        <meshStandardMaterial color={index % 3 === 0 ? '#3b7444' : '#285a35'} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Sunflower({ flower, index, isBlooming }: {
  flower: Flower; index: number; isBlooming: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const petals = useRef<Array<THREE.InstancedMesh | null>>([]);
  const seeds = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const petalGeometry = useMemo(() => createPetalGeometry(), []);
  const bloom = useRef(0.02);
  const previousBloom = useRef(isBlooming);
  const bloomStartedAt = useRef(0);
  const rows = useMemo(() => [
    { count: 18, radius: 0.12, length: 0.48, color: '#f4b800', z: -0.025 },
    { count: 14, radius: 0.095, length: 0.405, color: '#ffd233', z: 0.005 },
    { count: 10, radius: 0.07, length: 0.32, color: '#ffe36a', z: 0.035 },
  ], []);

  useLayoutEffect(() => {
    if (!seeds.current) return;
    const count = 116;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i += 1) {
      const t = (i + 0.5) / count;
      const radius = Math.sqrt(t) * 0.176;
      const angle = i * goldenAngle;
      dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.075 + (1 - t) * 0.055);
      const size = 0.012 + (1 - t) * 0.011;
      dummy.scale.set(size, size, size * 0.78);
      dummy.updateMatrix();
      seeds.current.setMatrixAt(i, dummy.matrix);
    }
    seeds.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;
    if (isBlooming && !previousBloom.current) bloomStartedAt.current = time;
    previousBloom.current = isBlooming;
    const open = isBlooming && time - bloomStartedAt.current >= flower.delay;
    bloom.current = THREE.MathUtils.damp(bloom.current, open ? 1 : 0.025, open ? 4.4 : 7, delta);
    const progress = THREE.MathUtils.smoothstep(bloom.current, 0, 1);

    rows.forEach((row, rowIndex) => {
      const mesh = petals.current[rowIndex];
      if (!mesh) return;
      for (let i = 0; i < row.count; i += 1) {
        const angle = (i / row.count) * Math.PI * 2 + rowIndex * 0.16;
        const variation = 0.9 + random(index * 100 + rowIndex * 30 + i) * 0.18;
        dummy.position.set(Math.sin(angle) * row.radius * progress, Math.cos(angle) * row.radius * progress, row.z);
        dummy.rotation.set((1 - progress) * 1.18 - rowIndex * 0.05, 0, -angle);
        dummy.scale.set(
          row.length * variation * (0.18 + progress * 0.82),
          row.length * variation * (0.28 + progress * 0.72), 1,
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });

    group.current.rotation.z = flower.rotation[2] + Math.sin(time * 0.78 + index * 1.7) * 0.018;
    group.current.scale.setScalar(flower.scale * (0.72 + progress * 0.28));
  });

  return (
    <group ref={group} position={flower.position} rotation={flower.rotation}>
      <mesh position={[0, 0, -0.055]} scale={[1, 1, 0.42]}>
        <sphereGeometry args={[0.22, 24, 16]} />
        <meshStandardMaterial color="#416b32" roughness={0.9} />
      </mesh>
      {rows.map((row, rowIndex) => (
        <instancedMesh
          key={row.color}
          ref={(node) => { petals.current[rowIndex] = node; }}
          args={[petalGeometry, undefined, row.count]}
        >
          <meshPhysicalMaterial color={row.color} emissive={row.color} emissiveIntensity={0.055} roughness={0.42} clearcoat={0.16} side={THREE.DoubleSide} />
        </instancedMesh>
      ))}
      <mesh position={[0, 0, 0.055]} scale={[1, 1, 0.42]}>
        <sphereGeometry args={[0.198, 30, 20]} />
        <meshStandardMaterial color="#5c2f12" roughness={0.88} />
      </mesh>
      <instancedMesh ref={seeds} args={[undefined, undefined, 116]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color="#24140c" roughness={0.68} />
      </instancedMesh>
      <mesh position={[-0.055, 0.065, 0.145]} scale={[0.055, 0.022, 0.012]} rotation={[0, 0, -0.35]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshBasicMaterial color="#ffd86a" transparent opacity={0.38} />
      </mesh>
    </group>
  );
}

function BabyBreath({ position, rotation, scale }: { position: V3; rotation: V3; scale: number }) {
  const data = useMemo(() => {
    const lines: number[] = [];
    const blossoms: V3[] = [];
    for (let i = 0; i < 11; i += 1) {
      const angle = i * 2.17;
      const radius = 0.12 + random(i + position[0] * 20) * 0.24;
      const end: V3 = [Math.cos(angle) * radius, 0.12 + random(i + 20) * 0.42, Math.sin(angle) * radius * 0.55];
      lines.push(0, -0.12, 0, ...end);
      blossoms.push(end);
    }
    return { lines: new Float32Array(lines), blossoms };
  }, [position]);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[data.lines, 3]} /></bufferGeometry>
        <lineBasicMaterial color="#5a7d4d" />
      </lineSegments>
      {data.blossoms.map((point, i) => (
        <group key={i} position={point}>
          {Array.from({ length: 5 }, (_, petal) => {
            const angle = petal * Math.PI * 0.4;
            return (
              <mesh key={petal} position={[Math.cos(angle) * 0.025, Math.sin(angle) * 0.025, 0]}>
                <sphereGeometry args={[0.022, 7, 6]} />
                <meshStandardMaterial color="#fffdf0" emissive="#fff7c2" emissiveIntensity={0.14} roughness={0.46} />
              </mesh>
            );
          })}
          <mesh position={[0, 0, 0.012]}>
            <sphereGeometry args={[0.012, 7, 6]} /><meshStandardMaterial color="#e8c547" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Foliage({ position, rotation, scale = 1 }: { position: V3; rotation: V3; scale?: number }) {
  const leaf = useMemo(() => createLeafGeometry(), []);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={leaf} rotation={[0.18, 0.1, -0.42]} position={[-0.08, 0, 0]}>
        <meshStandardMaterial color="#1f5134" roughness={0.82} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={leaf} rotation={[-0.12, -0.25, 0.58]} position={[0.09, -0.04, -0.02]} scale={[0.86, 0.92, 0.86]}>
        <meshStandardMaterial color="#397046" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function paperGeometry(points: Array<[number, number]>) {
  const shape = new THREE.Shape();
  shape.moveTo(...points[0]);
  points.slice(1).forEach((point) => shape.lineTo(...point));
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

function WrappingPaper() {
  const back = useMemo(() => paperGeometry([[-1.18, -1.18], [-1.52, 0.55], [0, 1.12], [1.52, 0.55], [1.18, -1.18]]), []);
  const left = useMemo(() => paperGeometry([[-1.18, -1.2], [-1.48, 0.58], [0.06, -0.02], [0, -1.6]]), []);
  const right = useMemo(() => paperGeometry([[1.18, -1.2], [1.48, 0.58], [-0.06, -0.02], [0, -1.6]]), []);
  return (
    <group position={[0, -0.28, -0.38]}>
      <mesh geometry={back} position={[0, 0.02, -0.12]}><meshPhysicalMaterial color="#f4e7c9" roughness={0.7} side={THREE.DoubleSide} /></mesh>
      <mesh geometry={left} position={[0, -0.03, 0.05]} rotation={[0, -0.13, -0.035]}><meshPhysicalMaterial color="#fff7e1" roughness={0.62} clearcoat={0.1} side={THREE.DoubleSide} /></mesh>
      <mesh geometry={right} position={[0, -0.03, 0.07]} rotation={[0, 0.13, 0.035]}><meshPhysicalMaterial color="#ead4ad" roughness={0.7} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -1.42, 0.025]} scale={[0.48, 0.5, 0.24]}>
        <coneGeometry args={[1, 1.65, 18, 1, true]} /><meshStandardMaterial color="#e7c991" roughness={0.76} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Ribbon() {
  const curves = useMemo(() => ({
    left: new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(-0.28, 0.2, 0.08), new THREE.Vector3(-0.42, 0.02, 0.02), new THREE.Vector3(-0.18, -0.1, 0.04), new THREE.Vector3()]),
    right: new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(0.28, 0.2, 0.08), new THREE.Vector3(0.42, 0.02, 0.02), new THREE.Vector3(0.18, -0.1, 0.04), new THREE.Vector3()]),
    tailLeft: new THREE.CatmullRomCurve3([new THREE.Vector3(-0.04, -0.03, 0), new THREE.Vector3(-0.18, -0.35, 0.02), new THREE.Vector3(-0.34, -0.7, -0.02)]),
    tailRight: new THREE.CatmullRomCurve3([new THREE.Vector3(0.04, -0.03, 0), new THREE.Vector3(0.2, -0.3, 0.03), new THREE.Vector3(0.29, -0.74, -0.03)]),
  }), []);
  return (
    <group position={[0, -1.34, 0.18]}>
      {[curves.left, curves.right].map((curve, i) => <mesh key={i}><tubeGeometry args={[curve, 32, 0.035, 8, false]} /><meshPhysicalMaterial color="#d5a622" roughness={0.3} metalness={0.22} clearcoat={0.38} /></mesh>)}
      {[curves.tailLeft, curves.tailRight].map((curve, i) => <mesh key={i}><tubeGeometry args={[curve, 22, 0.027, 7, false]} /><meshPhysicalMaterial color="#f2c84b" roughness={0.34} metalness={0.12} /></mesh>)}
      <mesh position={[0, 0.01, 0.025]} scale={[1.2, 0.82, 0.55]}><sphereGeometry args={[0.1, 16, 12]} /><meshStandardMaterial color="#bd8615" roughness={0.36} metalness={0.18} /></mesh>
    </group>
  );
}

function Pollen({ isBlooming }: Flower3DProps) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const count = 42;
  const base = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (random(i) - 0.5) * 3.4;
      values[i * 3 + 1] = random(i + 50) * 2.8 - 0.7;
      values[i * 3 + 2] = (random(i + 100) - 0.5) * 1.5 + 0.3;
    }
    return values;
  }, []);
  const positions = useMemo(() => base.slice(), [base]);
  useFrame((state, delta) => {
    if (!points.current || !material.current) return;
    const values = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = base[i * 3] + Math.sin(state.clock.elapsedTime * 0.24 + i * 1.7) * 0.08;
      values[i * 3 + 1] = base[i * 3 + 1] + Math.sin(state.clock.elapsedTime * 0.18 + i) * 0.07;
      values[i * 3 + 2] = base[i * 3 + 2] + Math.cos(state.clock.elapsedTime * 0.2 + i * 0.7) * 0.04;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    material.current.opacity = THREE.MathUtils.damp(material.current.opacity, isBlooming ? 0.48 : 0, 4, delta);
  });
  return (
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial ref={material} color="#ffd84a" size={0.024} transparent opacity={0} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export function Flower3D({ isBlooming }: Flower3DProps) {
  const bouquet = useRef<THREE.Group>(null);
  const reveal = useRef(0.02);
  const flowers = useMemo<Flower[]>(() => [
    { position: [0.02, 0.92, 0.1], rotation: [-0.08, 0.03, 0.04], scale: 1.05, delay: 0 },
    { position: [-0.53, 0.67, 0.18], rotation: [-0.06, 0.12, 0.2], scale: 0.93, delay: 0.08 },
    { position: [0.55, 0.63, 0.15], rotation: [-0.05, -0.14, -0.16], scale: 0.94, delay: 0.12 },
    { position: [-0.9, 0.3, -0.02], rotation: [0, 0.22, 0.27], scale: 0.8, delay: 0.18 },
    { position: [0.93, 0.28, -0.04], rotation: [0, -0.22, -0.26], scale: 0.8, delay: 0.22 },
    { position: [-0.28, 0.35, 0.35], rotation: [-0.1, 0.06, 0.08], scale: 0.96, delay: 0.15 },
    { position: [0.3, 0.32, 0.38], rotation: [-0.1, -0.06, -0.08], scale: 0.98, delay: 0.2 },
    { position: [-0.62, -0.03, 0.23], rotation: [-0.04, 0.13, 0.18], scale: 0.82, delay: 0.27 },
    { position: [0.66, -0.08, 0.2], rotation: [-0.04, -0.13, -0.18], scale: 0.84, delay: 0.3 },
    { position: [0, -0.03, 0.48], rotation: [-0.14, 0, 0], scale: 1.02, delay: 0.24 },
    { position: [-0.28, -0.38, 0.28], rotation: [-0.05, 0.1, 0.08], scale: 0.76, delay: 0.34 },
    { position: [0.32, -0.4, 0.3], rotation: [-0.05, -0.1, -0.08], scale: 0.78, delay: 0.38 },
  ], []);
  const filler: Array<{ position: V3; rotation: V3; scale: number }> = [
    { position: [-1.02, 0.62, -0.05], rotation: [0, 0, 0.35], scale: 1.1 },
    { position: [1.02, 0.57, -0.06], rotation: [0, 0, -0.32], scale: 1.05 },
    { position: [-0.76, 0.06, 0.13], rotation: [0, 0, 0.26], scale: 0.92 },
    { position: [0.78, 0.02, 0.12], rotation: [0, 0, -0.25], scale: 0.92 },
    { position: [-0.12, 0.7, -0.12], rotation: [0, 0, 0.1], scale: 0.88 },
    { position: [0.12, 0.44, -0.08], rotation: [0, 0, -0.08], scale: 0.82 },
  ];

  useFrame((state, delta) => {
    if (!bouquet.current) return;
    reveal.current = THREE.MathUtils.damp(reveal.current, isBlooming ? 1 : 0.08, isBlooming ? 2.8 : 5, delta);
    bouquet.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.035;
    bouquet.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.31) * 0.006;
    bouquet.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.012 - (1 - reveal.current) * 0.16;
    bouquet.current.scale.setScalar(0.82 + reveal.current * 0.18);
  });

  return (
    <group ref={bouquet}>
      <WrappingPaper />
      <group position={[0, 0, -0.2]}>
        {flowers.map((flower, index) => <Stem key={index} flower={flower} index={index} />)}
        <Foliage position={[-0.86, -0.2, 0.02]} rotation={[0.1, 0.15, 0.42]} scale={0.78} />
        <Foliage position={[0.87, -0.18, 0.02]} rotation={[0.1, -0.15, -0.42]} scale={0.78} />
        <Foliage position={[-0.55, 0.34, -0.08]} rotation={[0.08, 0.2, 0.65]} scale={0.7} />
        <Foliage position={[0.56, 0.32, -0.08]} rotation={[0.08, -0.2, -0.65]} scale={0.7} />
      </group>
      {filler.map((item, index) => <BabyBreath key={index} {...item} />)}
      {flowers.slice().sort((a, b) => a.position[2] - b.position[2]).map((flower, index) => (
        <Sunflower key={`${flower.position.join('-')}-${index}`} flower={flower} index={index} isBlooming={isBlooming} />
      ))}
      <Ribbon />
      <Pollen isBlooming={isBlooming} />
    </group>
  );
}