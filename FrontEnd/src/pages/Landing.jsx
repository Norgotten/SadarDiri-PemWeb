import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaArrowRight, FaMoneyBillWave, FaSkull } from "react-icons/fa";

export default function Landing() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isExpanded ? "hidden" : "unset";
  }, [isExpanded]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* BACKGROUND EFEK */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-yellow-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[120px] animate-pulse delay-75" />
      </div>

      {/* NAVIGASI SIMPEL */}
      <nav className="relative z-20 flex justify-between items-center p-6 container mx-auto">
        <h1 className="text-2xl font-extrabold tracking-tighter">
          Sadar<span className="text-yellow-500">Diri.</span>
        </h1>
      </nav>

      {/* HERO SECTION */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500"
        >
          DOMPET BUTUH <br /> <span className="text-yellow-500">KEADILAN.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
        >
          Berhenti denial. Uangmu habis bukan karena tuyul, tapi karena gaya hidupmu yang nggak ngotak. 
          Ayo tracking <b>keborosanmu</b> dan siap-siap kena mental.
        </motion.p>

        {/* TOMBOL UTAMA */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div layoutId="cta-container" className="relative">
              <motion.button
                layoutId="cta-bg"
                onClick={() => setIsExpanded(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-3 bg-yellow-500 text-black px-8 py-4 rounded-full text-xl font-bold shadow-[0_0_40px_-10px_rgba(234,179,8,0.6)]"
              >
                <span>Mulai Sadar Diri</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL PILIHAN (EXPAND) */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              layoutId="cta-container"
              className="relative w-full max-w-2xl bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl"
            >
              <motion.div layoutId="cta-bg" className="absolute inset-0 bg-gray-900" />
              
              <div className="relative z-10 p-8 sm:p-12 flex flex-col items-center">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-6 right-6 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition"
                >
                  <FaTimes />
                </button>

                <h2 className="text-3xl font-bold mb-2 text-white">Tentukan Langkah</h2>
                <p className="text-gray-400 mb-8 text-center">Udah punya akun atau mau mulai lembaran baru?</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {/* Register */}
                  <Link to="/register" className="group relative overflow-hidden bg-yellow-500 p-6 rounded-2xl flex flex-col items-center text-center hover:bg-yellow-400 transition-colors">
                    <div className="mb-4 bg-black/10 p-4 rounded-full">
                      <FaMoneyBillWave className="text-3xl text-black" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-1">Daftar Baru</h3>
                    <p className="text-black/70 text-sm">Buat akun biar pengeluaran tercatat.</p>
                  </Link>

                  {/* Login */}
                  <Link to="/login" className="group relative overflow-hidden bg-gray-800 border border-gray-700 p-6 rounded-2xl flex flex-col items-center text-center hover:bg-gray-750 hover:border-gray-600 transition-all">
                    <div className="mb-4 bg-gray-700 p-4 rounded-full group-hover:bg-gray-600 transition">
                      <FaSkull className="text-3xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Login</h3>
                    <p className="text-gray-400 text-sm">Lanjut hadapi kenyataan lagi.</p>
                  </Link>
                </div>

                <p className="mt-8 text-xs text-gray-500 uppercase tracking-widest">
                  Warning: Aplikasi ini mengandung unsur kekerasan verbal.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}