import { useEffect, useState } from 'react';
import api from '../utils/api';
import '../utils/chartSetup';
import { Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ModalAdd from '../components/ModalAdd';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Ambil data dashboard dari backend
  const fetchDashboard = async () => {
    try {
      const res = await api.get('/transactions/dashboard');
      setData(res.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    // FIX SCROLL: Pastikan scroll nyala lagi setelah dari Landing Page
    document.body.style.overflow = 'auto';
    fetchDashboard();
  }, []);

  // Tampilan Loading (Skeleton)
  if (loading) return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 md:ml-64 p-8 space-y-6">
        <div className="h-20 bg-gray-900 rounded-xl animate-pulse" />
        <div className="h-48 bg-gray-900 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-900 rounded-3xl animate-pulse" />
          <div className="h-64 bg-gray-900 rounded-3xl animate-pulse" />
        </div>
      </div>
    </div>
  );

  // Data untuk Pie Chart
  const chartData = {
    labels: Object.keys(data.categoryBreakdown),
    datasets: [
      {
        data: Object.values(data.categoryBreakdown),
        backgroundColor: ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#F472B6'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black overflow-hidden">
      
      {/* 1. Sidebar Navigasi */}
      <Sidebar />

      {/* 2. Konten Utama (Scrollable) */}
      <div className="flex-1 md:ml-64 h-full overflow-y-auto relative">
        
        {/* Background Efek */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-yellow-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[120px] animate-pulse delay-75" />
        </div>

        <div className="relative z-10 p-6 pb-24 max-w-6xl mx-auto">
          
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">Halo, <span className="text-yellow-500">{user?.username}</span> 👋</h1>
              <p className="text-gray-400 text-sm">Siap sadar diri hari ini?</p>
            </div>
          </div>

          {/* STATUS CARD (ROASTING) */}
          <div className={`p-6 rounded-3xl mb-8 shadow-2xl border backdrop-blur-md transition-all duration-500 ${
            data.status === 'Bahaya' ? 'bg-red-900/20 border-red-500/50' : 
            data.status === 'Waspada' ? 'bg-orange-900/20 border-orange-500/50' : 
            'bg-green-900/20 border-green-500/50'
          }`}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest opacity-70 font-bold mb-1">Status Keuangan</p>
                <h2 className={`text-4xl font-black ${
                  data.status === 'Bahaya' ? 'text-red-500' : 
                  data.status === 'Waspada' ? 'text-orange-500' : 
                  'text-green-500'
                }`}>{data.status} ⚠️</h2>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Total Pengeluaran</p>
                <p className="text-3xl font-bold text-white">Rp {data.totalExpense.toLocaleString()}</p>
              </div>
            </div>
            {/* --- FITUR INOVASI: KONVERSI BARANG HALU --- */}
            <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-sm mb-6 flex items-center gap-4">
              <div className="bg-yellow-500/20 p-4 rounded-full">
                <span className="text-3xl">💡</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-200">Tahukah kamu?</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Total pengeluaranmu setara dengan <span className="text-yellow-500 font-bold text-lg">{(data.totalExpense / 15000).toFixed(0)} Piring Seblak</span> atau <span className="text-red-400 font-bold text-lg">{(data.totalExpense / 5000000).toFixed(2)}x iPhone 13</span>. 
                  <br/>Mending dipake nabung gak sih?
                </p>
              </div>
            </div>
            {/* Pesan Roasting */}
            <div className="mt-6 bg-black/40 p-4 rounded-xl border-l-4 border-yellow-500 italic text-gray-300">
              "{data.message}"
            </div>
          </div>

          {/* GRID CONTENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* KIRI: CHART */}
            <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-6 text-gray-200">Peta Pengeluaran</h3>
              {Object.keys(data.categoryBreakdown).length > 0 ? (
                <div className="w-64 h-64 mx-auto">
                  <Pie data={chartData} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500 italic">
                  <p>Belum ada pengeluaran.</p>
                  <p className="text-sm">Dompet aman, hati tenang.</p>
                </div>
              )}
            </div>

            {/* KANAN: LIST TRANSAKSI (Read Only) */}
            <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-sm flex flex-col h-[400px]">
              <h3 className="text-lg font-bold mb-4 text-gray-200">Riwayat Terakhir</h3>
              
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {data.lastTransactions.length > 0 ? (
                  data.lastTransactions.map((trx) => (
                    <div key={trx._id} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
                      <div className="flex items-center gap-4">
                        {/* Thumbnail Bukti */}
                        {trx.imageUrl ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-700 flex-shrink-0">
                            <img src={trx.imageUrl} alt="struk" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-xl flex-shrink-0">💸</div>
                        )}
                        
                        {/* Info Transaksi */}
                        <div>
                          <p className="font-bold text-white line-clamp-1">{trx.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(trx.date).toLocaleDateString()} • <span className="text-yellow-500">{trx.category}</span>
                          </p>
                        </div>
                      </div>

                      {/* Nominal */}
                      <div className="text-right">
                        <span className="font-bold text-red-400 text-sm whitespace-nowrap">
                          -Rp {trx.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p>Masih aman, belum ada pengeluaran.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                 <p className="text-xs text-gray-500">Ingin hapus/edit? Buka menu <span className="text-yellow-500">Riwayat Pengeluaran</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* FAB TOMBOL PLUS (Tetap ada biar cepat nambah) */}
        <motion.button 
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.1, rotate: 90 }} 
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-8 right-8 bg-yellow-500 text-black p-5 rounded-full 
          shadow-[0_0_40px_-10px_rgba(234,179,8,0.8)] 
          hover:shadow-[0_0_60px_-10px_rgba(234,179,8,1)] z-50 group"
        >
          <FaPlus size={24} className="group-hover:text-white transition-colors" />
        </motion.button>

        {/* Modal Tambah Data */}
        <ModalAdd 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onSuccess={fetchDashboard} 
        />
      </div>
    </div>
  );
};

export default Dashboard;