import { useState, useEffect } from 'react';
import { FaTimes, FaCamera } from 'react-icons/fa';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const ModalAdd = ({ isOpen, onClose, onSuccess, transactionToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Makanan',
    date: '',
    image: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        title: transactionToEdit.title,
        amount: transactionToEdit.amount,
        category: transactionToEdit.category,
        date: transactionToEdit.date.split('T')[0],
        image: null
      });
    } else {
      setFormData({ title: '', amount: '', category: 'Makanan', date: '', image: null });
    }
  }, [transactionToEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('amount', formData.amount);
    data.append('category', formData.category);
    data.append('date', formData.date);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (transactionToEdit) {
        await api.put(`/transactions/${transactionToEdit._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Data berhasil diperbarui!');
      } else {
        await api.post('/transactions', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Berhasil dicatat!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {transactionToEdit ? 'Edit Pengeluaran' : 'Catat Pengeluaran'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition transform hover:rotate-90">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Buat beli apa?</label>
                <input type="text" name="title" required value={formData.title} className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-yellow-500 outline-none transition" placeholder="Nasi Padang..." onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Harganya?</label>
                  <input type="number" name="amount" required value={formData.amount} className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-yellow-500 outline-none transition" onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Kategori</label>
                  <select name="category" value={formData.category} className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-yellow-500 outline-none transition cursor-pointer" onChange={handleChange}>
                    <option value="Makanan">Makanan</option>
                    <option value="Transport">Transport</option>
                    <option value="Hiburan">Hiburan</option>
                    <option value="Tagihan">Tagihan</option>
                    <option value="Belanja">Belanja</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Kapan?</label>
                {/* FIX TANGGAL: Pake onClick showPicker biar gampang diklik */}
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-yellow-500 outline-none transition cursor-pointer" 
                  onChange={handleChange}
                  onClick={(e) => e.target.showPicker()} 
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  {transactionToEdit ? 'Ganti Bukti Struk (Opsional)' : 'Bukti Struk (Opsional)'}
                </label>
                <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-yellow-500 hover:text-yellow-500 text-gray-500 transition group">
                  <FaCamera className="group-hover:scale-110 transition" />
                  <span>{formData.image ? formData.image.name : 'Klik buat upload foto'}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading} 
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition disabled:opacity-50 shadow-lg shadow-yellow-500/20"
              >
                {loading ? 'Menyimpan...' : (transactionToEdit ? 'Update Data' : 'Simpan Pengeluaran')}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalAdd;