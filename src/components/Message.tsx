import { motion } from 'framer-motion';

interface MessageProps {
  isVisible: boolean;
}

export function Message({ isVisible }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 20,
        scale: isVisible ? 1 : 0.95,
      }}
      transition={{ 
        duration: 0.8, 
        delay: 0.5,
        type: "spring",
        stiffness: 100,
      }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none"
      style={{ maxWidth: '90vw' }}
    >
      <motion.h1
        className="text-3xl md:text-5xl font-bold text-yellow-100 serif mb-4 drop-shadow-lg"
        initial={{ scale: 0.8 }}
        animate={{ scale: isVisible ? 1 : 0.8 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        Para Jhajaira 🌻
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-yellow-50 mb-3 font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        Porque contigo la vida tiene más color.
      </motion.p>

      <motion.p
        className="text-base md:text-lg text-yellow-100 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        Feliz Día de la Amistad y de la Primavera 💛
      </motion.p>

      <motion.div
        className="mt-6 flex justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <span className="text-2xl animate-float" style={{ animationDelay: '0s' }}>🌼</span>
        <span className="text-2xl animate-float" style={{ animationDelay: '0.2s' }}>🌻</span>
        <span className="text-2xl animate-float" style={{ animationDelay: '0.4s' }}>💛</span>
        <span className="text-2xl animate-float" style={{ animationDelay: '0.6s' }}>🌼</span>
        <span className="text-2xl animate-float" style={{ animationDelay: '0.8s' }}>🌻</span>
      </motion.div>
    </motion.div>
  );
}
