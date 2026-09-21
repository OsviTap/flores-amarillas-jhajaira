import { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Flower3D } from './components/Flower3D';
import { PetalsCanvas } from './components/PetalsCanvas';
import { Message } from './components/Message';
import { CTAButtons } from './components/CTAButtons';
import { CouponModal } from './components/CouponModal';

const COUPON_REDEEMED_KEY = 'jhajaira-coupon-redeemed';

function getExpiryTime(): number {
  const now = new Date();
  const boliviaOffset = -4 * 60;
  const localOffset = now.getTimezoneOffset();
  const diffMinutes = localOffset + boliviaOffset;
  const boliviaTime = new Date(now.getTime() + diffMinutes * 60 * 1000);

  const endOfDay = new Date(boliviaTime);
  endOfDay.setHours(23, 59, 59, 999);

  return endOfDay.getTime() - diffMinutes * 60 * 1000;
}

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function App() {
  const [isBlooming, setIsBlooming] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);

  const [expiryTime] = useState(() => getExpiryTime());
  const [isRedeemed, setIsRedeemed] = useState(() => localStorage.getItem(COUPON_REDEEMED_KEY) === 'true');
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = expiryTime - now;
      setTimeLeft(formatTimeLeft(remaining));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  const getCouponStatus = useCallback((): 'active' | 'redeemed' | 'expired' => {
    if (isRedeemed) return 'redeemed';
    if (Date.now() > expiryTime) return 'expired';
    return 'active';
  }, [isRedeemed, expiryTime]);

  const handleOpenGift = () => {
    setIsBlooming(true);
    setTimeout(() => setIsCouponOpen(true), 1000);
  };

  const handleRedeemCoupon = () => {
    setIsRedeemed(true);
    localStorage.setItem(COUPON_REDEEMED_KEY, 'true');
  };

  setTimeout(() => setShowButtons(true), 1500);

  return (
    <div className="w-full h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #0a1628 0%, #0d2847 30%, #0e3d5e 50%, #0d4f6e 70%, #1a6b6e 100%)'
    }}>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center bottom, rgba(64,224,208,0.1) 0%, transparent 60%)'
      }} />

      <Canvas camera={{ position: [0, 0.8, 5], fov: 45 }} style={{ position: 'absolute', inset: 0, background: 'transparent' }}>
        <fog attach="fog" args={['#0d2847', 10, 30]} />

        <ambientLight intensity={0.4} color="#fef3c7" />
        <directionalLight position={[2, 4, 3]} intensity={2} color="#fef3c7" castShadow />
        <pointLight position={[-2, 2, 2]} intensity={0.8} color="#fbbf24" distance={8} />
        <pointLight position={[1.5, 1, -1.5]} intensity={0.4} color="#f472b6" distance={6} />
        <pointLight position={[0, 2, 0]} intensity={0.6} color="#fef9c3" distance={10} />
        <pointLight position={[0, -1, 2]} intensity={0.3} color="#fde68a" distance={5} />

        <Flower3D isBlooming={isBlooming} />
        <PetalsCanvas isActive={isBlooming} count={80} />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.6}
            luminanceSmoothing={0.4}
            intensity={0.8}
            radius={0.6}
          />
        </EffectComposer>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={0.12}
          target={[0, 0, 0]}
        />
      </Canvas>

      <Message isVisible={true} />

      <CTAButtons
        onOpenGift={handleOpenGift}
        showButtons={showButtons}
      />

      <CouponModal
        isOpen={isCouponOpen}
        onClose={() => setIsCouponOpen(false)}
        onRedeem={handleRedeemCoupon}
        status={getCouponStatus()}
        timeLeft={timeLeft}
      />
    </div>
  );
}
