import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Flower3D } from './components/Flower3D';
import { Volleyball } from './components/Volleyball';
import { PetalsCanvas } from './components/PetalsCanvas';
import { Message } from './components/Message';
import { CTAButtons } from './components/CTAButtons';

export default function App() {
  const [isBlooming, setIsBlooming] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showSendButton, setShowSendButton] = useState(false);

  const handleOpenGift = () => {
    setIsBlooming(true);
    setTimeout(() => setShowSendButton(true), 2500);
  };

  const handleSendFlowers = () => {
    alert('¡Flores enviadas con amor! 💛');
  };

  setTimeout(() => setShowButtons(true), 1500);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-yellow-900 via-yellow-800 to-green-900 relative overflow-hidden">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#facc15" />

        <Suspense fallback={null}>
          <Flower3D isBlooming={isBlooming} />
          <Volleyball />
          <PetalsCanvas isActive={isBlooming} count={50} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      <Message isVisible={true} />

      <CTAButtons
        onOpenGift={handleOpenGift}
        onSendFlowers={handleSendFlowers}
        showButtons={showButtons}
        showSendButton={showSendButton}
      />
    </div>
  );
}
