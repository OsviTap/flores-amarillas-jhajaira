import { useMemo } from 'react';
import { Petal } from './Petal';

interface PetalsCanvasProps {
  isActive: boolean;
  count?: number;
}

export function PetalsCanvas({ isActive, count = 50 }: PetalsCanvasProps) {
  const petals = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 + 5,
        (Math.random() - 0.5) * 10 - 5,
      ] as [number, number, number],
      rotationSpeed: Math.random() * 0.5 + 0.5,
      fallSpeed: Math.random() * 2 + 1,
      size: Math.random() * 0.3 + 0.2,
      delay: Math.random() * 5,
    }));
  }, [count]);

  if (!isActive) return null;

  return (
    <>
      {petals.map((petal, i) => (
        <Petal key={i} {...petal} />
      ))}
    </>
  );
}
