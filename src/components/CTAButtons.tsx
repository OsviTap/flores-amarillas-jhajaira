import { motion } from 'framer-motion';

interface CTAButtonsProps {
  onOpenGift: () => void;
  onSendFlowers: () => void;
  showButtons: boolean;
  showSendButton: boolean;
}

export function CTAButtons({ onOpenGift, onSendFlowers, showButtons, showSendButton }: CTAButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: showButtons ? 1 : 0, y: showButtons ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col gap-4 items-center"
    >
      {showButtons && (
        <>
          <motion.button
            onClick={onOpenGift}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all text-lg"
          >
            🌼 Abrir tu regalo
          </motion.button>

          {showSendButton && (
            <motion.button
              onClick={onSendFlowers}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, duration: 0.5 }}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-yellow-50 border-2 border-yellow-200/50 font-medium rounded-full hover:bg-white/30 transition-all"
            >
              💛 Enviar flores a Jhajaira
            </motion.button>
          )}
        </>
      )}
    </motion.div>
  );
}
