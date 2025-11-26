import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessScreen = ({ isOpen, message, subMessage }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-lg text-white"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center"
          >
            {/* Ikon Centang Besar */}
            <div className="bg-green-500/20 p-6 rounded-full mb-6 shadow-[0_0_50px_-10px_rgba(34,197,94,0.5)]">
              <FaCheckCircle className="text-6xl text-green-500" />
            </div>

            {/* Teks Utama */}
            <h2 className="text-3xl font-black text-yellow-500 mb-2 text-center tracking-tighter">
              {message}
            </h2>

            {/* Sub Teks (Loading bar animation) */}
            <p className="text-gray-400 text-lg mb-8 text-center max-w-md px-4">
              {subMessage}
            </p>

            {/* Loading Bar Palsu biar keren */}
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-yellow-500"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessScreen;