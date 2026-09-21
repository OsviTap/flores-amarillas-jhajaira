import { motion } from 'framer-motion';

interface CTAButtonsProps {
  onOpenGift: () => void;
  showButtons: boolean;
}

export function CTAButtons({ onOpenGift, showButtons }: CTAButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: showButtons ? 1 : 0, y: showButtons ? 0 : 30 }}
      transition={{ duration: 0.8 }}
      className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 z-20"
    >
      {showButtons && (
        <motion.button
          onClick={onOpenGift}
          whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(64,224,208,0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 font-semibold rounded-full shadow-xl transition-all text-sm sm:text-base md:text-lg tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #40e0d0 0%, #20b2aa 50%, #008b8b 100%)',
            color: '#0a1628',
            boxShadow: '0 4px 30px rgba(64,224,208,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          🌊 Abrir tu regalo
        </motion.button>
      )}
    </motion.div>
  );
}
