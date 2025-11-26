import { useEffect, useState } from 'react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import { FaSearch, FaTimes, FaEye, FaFilter, FaTrash, FaPen, FaChevronDown } from 'react-icons/fa'; // Tambah Chevron
import { motion, AnimatePresence } from 'framer-motion';
import ModalAdd from '../components/ModalAdd';
import Swal from 'sweetalert2'; // Import SweetAlert

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions'); 
      setTransactions(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'auto';
    fetchTransactions();
  }, []);

  // --- DELETE PAKE SWEETALERT2 ---
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Yakin mau hapus?',
      text: "Data yang dihapus gak bisa balik lagi loh!",
      icon: 'warning',
      background: '#1f2937', // Gelap
      color: '#fff',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/transactions/${id}`);
          fetchTransactions();
          Swal.fire({
            title: 'Terhapus!',
            text: 'Data berhasil dimusnahkan.',
            icon: 'success',
            background: '#1f2937',
            color: '#fff',
            confirmButtonColor: '#eab308'
          });
        } catch (error) {
          Swal.fire('Error', 'Gagal menghapus data', 'error');
        }
      }
    });
  };

  const handleEdit = (transaction) => {
    setTransactionToEdit(transaction); 
    setShowModal(true); 
  };

  const filteredData = transactions.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'All' || t.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="flex h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 md:ml-64 p-8 h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-20">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Riwayat Pengeluaran 📜</h1>
              <p className="text-gray-400">Kelola semua data transaksi di sini.</p>
            </div>
            <button 
              onClick={() => { setTransactionToEdit(null); setShowModal(true); }}
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20"
            >
              + Tambah Data
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 flex gap-3 backdrop-blur-sm flex-1 transition focus-within:border-yellow-500">
              <FaSearch className="text-gray-500 mt-1" />
              <input 
                type="text" 
                placeholder="Cari transaksi..." 
                className="bg-transparent w-full text-white outline-none placeholder-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* --- FILTER DROPDOWN YANG LEBIH BAGUS --- */}
            <div className="relative group">
              <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 flex items-center gap-3 backdrop-blur-sm h-full min-w-[200px] cursor-pointer hover:border-gray-600 transition">
                <FaFilter className="text-yellow-500" />
                <select 
                  className="bg-transparent text-white outline-none cursor-pointer appearance-none w-full font-medium"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All" className="bg-gray-900">Semua Kategori</option>
                  <option value="Makanan" className="bg-gray-900">Makanan</option>
                  <option value="Transport" className="bg-gray-900">Transport</option>
                  <option value="Hiburan" className="bg-gray-900">Hiburan</option>
                  <option value="Tagihan" className="bg-gray-900">Tagihan</option>
                  <option value="Belanja" className="bg-gray-900">Belanja</option>
                  <option value="Lainnya" className="bg-gray-900">Lainnya</option>
                </select>
                {/* Custom Arrow Icon */}
                <FaChevronDown className="text-gray-500 text-xs absolute right-4 pointer-events-none group-hover:text-white transition" />
              </div>
            </div>
          </div>

          {/* TABEL DATA (Sama kayak sebelumnya) */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Keperluan</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Nominal</th>
                    <th className="p-4">Bukti</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {loading ? (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading data...</td></tr>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((t) => (
                      <tr key={t._id} className="hover:bg-gray-800/50 transition">
                        <td className="p-4 text-gray-400 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="p-4 font-bold">{t.title}</td>
                        <td className="p-4">
                          <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                            {t.category}
                          </span>
                        </td>
                        <td className="p-4 text-red-400 font-mono font-bold">-Rp {t.amount.toLocaleString()}</td>
                        <td className="p-4">
                          {t.imageUrl ? (
                            <button onClick={() => setSelectedImage(t.imageUrl)} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline text-xs bg-blue-400/10 px-2 py-1 rounded">
                              <FaEye /> Lihat
                            </button>
                          ) : <span className="text-gray-600 text-xs">-</span>}
                        </td>
                        
                        <td className="p-4 flex justify-center gap-2">
                          <button onClick={() => handleEdit(t)} className="bg-gray-700 hover:bg-blue-600 text-white p-2 rounded-lg transition" title="Edit">
                            <FaPen size={12} />
                          </button>
                          <button onClick={() => handleDelete(t._id)} className="bg-gray-700 hover:bg-red-600 text-white p-2 rounded-lg transition" title="Hapus">
                            <FaTrash size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">Tidak ada data.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ModalAdd isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={fetchTransactions} transactionToEdit={transactionToEdit} />

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative max-w-3xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition z-10">
                <FaTimes />
              </button>
              <img src={selectedImage} alt="Bukti" className="w-full h-full object-contain max-h-[85vh]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;