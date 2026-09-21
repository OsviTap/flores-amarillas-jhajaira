import { motion } from 'framer-motion';

interface MessageProps {
  isVisible: boolean;
}

export function Message({ isVisible }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 30,
        scale: isVisible ? 1 : 0.9,
      }}
      transition={{
        duration: 1,
        delay: 0.5,
        type: "spring",
        stiffness: 80,
      }}
      className="absolute top-4 sm:top-6 md:top-8 left-1/2 transform -translate-x-1/2 text-center z-10 pointer-events-none w-full px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="inline-block"
      >
        <h1
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 drop-shadow-2xl"
          style={{
            fontFamily: "'Playfair Display', serif",
            background: 'linear-gradient(135deg, #e0f7fa 0%, #40e0d0 50%, #20b2aa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(0 4px 20px rgba(64,224,208,0.4))',
          }}
        >
          Para Jhajaira 💎
        </h1>
      </motion.div>

      <motion.p
        className="text-sm sm:text-base md:text-xl mb-2 sm:mb-3 font-light tracking-wide"
        style={{ color: '#e0f7fa', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        Porque contigo la vida tiene más color.
      </motion.p>

      <motion.p
        className="text-xs sm:text-sm md:text-lg font-medium"
        style={{ color: '#b2ebf2', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        Feliz Día de la Amistad y de la Primavera 💙
      </motion.p>

      <motion.div
        className="mt-3 sm:mt-4 md:mt-5 flex justify-center gap-2 sm:gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 2.3, duration: 0.8 }}
      >
        {['💎', '🌊', '💙', '✨', '🔮'].map((emoji, i) => (
          <motion.span
            key={i}
            className="text-lg sm:text-xl md:text-2xl"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}
