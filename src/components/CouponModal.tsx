import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedeem: () => void;
  status: 'active' | 'redeemed' | 'expired';
  timeLeft: string;
}

export function CouponModal({ isOpen, onClose, onRedeem, status, timeLeft }: CouponModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {}, [isOpen, status]);

  const handleRedeem = () => {
    setShowConfetti(true);
    setTimeout(() => {
      onRedeem();
      setShowConfetti(false);
    }, 1500);
  };

  const getStatusStyle = () => {
    switch (status) {
      case 'active':
        return {
          border: 'border-cyan-400/40',
          glow: '0 0 40px rgba(64,224,208,0.2)',
        };
      case 'redeemed':
        return {
          border: 'border-green-400/50',
          glow: '0 0 30px rgba(74,222,128,0.2)',
        };
      case 'expired':
        return {
          border: 'border-gray-500/30',
          glow: '0 0 15px rgba(107,114,128,0.1)',
        };
    }
  };

  const style = getStatusStyle();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-md rounded-2xl sm:rounded-3xl border ${style.border} overflow-hidden max-h-[90vh] overflow-y-auto`}
            style={{
              background: `linear-gradient(135deg, rgba(10,22,40,0.97), rgba(13,40,71,0.97))`,
              boxShadow: style.glow,
            }}
          >
            {/* Decoracion superior */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

            {/* Contenido */}
            <div className="p-4 sm:p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-4 sm:mb-5">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl sm:text-4xl mb-2"
                >
                  {status === 'expired' ? '💔' : '💎'}
                </motion.div>
                <h2
                  className="text-xl sm:text-2xl font-bold mb-1"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    background: status === 'expired'
                      ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                      : 'linear-gradient(135deg, #e0f7fa, #40e0d0, #20b2aa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {status === 'expired' ? 'Cupón Expirado' : 'Cupón de Confianza'}
                </h2>
                {status === 'active' && (
                  <p className="text-cyan-200/60 text-xs sm:text-sm">Para Jhajaira 🌊</p>
                )}
              </div>

              {/* Mensaje */}
              <div
                className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-5 ${
                  status === 'expired' ? 'bg-gray-800/30' : 'bg-cyan-900/20'
                }`}
                style={{
                  border: status === 'expired'
                    ? '1px solid rgba(107,114,128,0.2)'
                    : '1px solid rgba(64,224,208,0.15)',
                }}
              >
                <p
                  className={`text-xs sm:text-sm leading-relaxed italic ${
                    status === 'expired' ? 'text-gray-400' : 'text-cyan-100/80'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  "Se que estos días fueron difíciles, complicados por la situación que te está
                  pasando, pero aquí ya tienes a alguien en el que puedes confiar para todo,
                  estaré siempre brindándote todo mi cariño y mi ser para poder apoyarte en
                  todo lo que te propongas, que esta relación que estamos formando sea para
                  mejor y siga creciendo, daré todo de mi parte y espero que por parte de la
                  tuya sea igual. Se te quiere Jhajaira, que pases un lindo día, que te lo
                  mereces eso y mucho más!"
                </p>
              </div>

              {/* Temporizador */}
              {status === 'active' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mb-4 sm:mb-5"
                >
                  <p className="text-cyan-200/50 text-[10px] sm:text-xs uppercase tracking-widest mb-2">
                    Expira en
                  </p>
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {timeLeft.split(':').map((unit, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <motion.div
                          key={unit}
                          initial={{ rotateX: -90, opacity: 0 }}
                          animate={{ rotateX: 0, opacity: 1 }}
                          className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold"
                          style={{
                            background: 'linear-gradient(135deg, #0d4f6e, #0e3d5e)',
                            color: '#40e0d0',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                          }}
                        >
                          {unit}
                        </motion.div>
                        <span className="text-cyan-200/40 text-[8px] sm:text-[10px] mt-1 uppercase tracking-wider">
                          {i === 0 ? 'horas' : i === 1 ? 'min' : 'seg'}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Estado canjeado */}
              {status === 'redeemed' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-4 sm:mb-5 py-3 sm:py-4 rounded-xl"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
                >
                  <span className="text-2xl sm:text-3xl">✅</span>
                  <p className="text-green-300 font-medium mt-2 text-sm sm:text-base">Cupón canjeado exitosamente</p>
                  <p className="text-green-400/60 text-xs sm:text-sm mt-1">Tu deseo ha sido enviado</p>
                </motion.div>
              )}

              {/* Mensaje + Boton */}
              {status === 'active' && (
                <div>
                  <div
                    className="rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 text-center"
                    style={{
                      background: 'rgba(13,79,110,0.2)',
                      border: '1px solid rgba(64,224,208,0.15)',
                    }}
                  >
                    <p className="text-cyan-100/80 text-xs sm:text-sm">
                      💌 <span className="font-medium">Escríbeme tu deseo por mensaje</span>
                    </p>
                    <p className="text-cyan-200/40 text-[10px] sm:text-xs mt-1">Te espero en Instagram</p>
                  </div>

                  <motion.a
                    href="https://www.instagram.com/osvitap_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleRedeem}
                    whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(64,224,208,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    className="block w-full py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all cursor-pointer text-center"
                    style={{
                      background: 'linear-gradient(135deg, #40e0d0, #20b2aa, #008b8b)',
                      color: '#0a1628',
                      boxShadow: '0 4px 20px rgba(64,224,208,0.3)',
                      textDecoration: 'none',
                    }}
                  >
                    💎 Enviar mi deseo por IG
                  </motion.a>

                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full mt-3 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer"
                    style={{
                      background: 'rgba(64,224,208,0.1)',
                      border: '1px solid rgba(64,224,208,0.2)',
                      color: '#e0f7fa',
                    }}
                  >
                    ⏰ Ver después
                  </motion.button>
                </div>
              )}

              {/* Boton cerrar */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-cyan-200/40 hover:text-cyan-200 hover:bg-cyan-900/30 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Confetti */}
            <AnimatePresence>
              {showConfetti && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                >
                  {Array.from({ length: 25 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        x: '50%',
                        y: '50%',
                        scale: 0,
                        rotate: 0,
                      }}
                      animate={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        scale: [0, 1, 0],
                        rotate: Math.random() * 360,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: Math.random() * 0.3,
                        ease: 'easeOut',
                      }}
                      className="absolute text-lg sm:text-xl"
                    >
                      {['💎', '🌊', '✨', '💙', '🔮'][i % 5]}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
