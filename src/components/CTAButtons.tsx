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
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col gap-4 items-center"
    >
      {showButtons && (
        <motion.button
          onClick={onOpenGift}
          whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(251,191,36,0.6)' }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 font-semibold rounded-full shadow-xl transition-all text-lg tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
            color: '#451a03',
            boxShadow: '0 4px 30px rgba(251,191,36,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          🌼 Abrir tu regalo
        </motion.button>
      )}
    </motion.div>
  );
}
