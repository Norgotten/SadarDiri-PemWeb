import { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import SuccessScreen from '../components/SuccessScreen'; // 1. Import ini

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // 2. State buat layar sukses
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      // --- LOGIC BARU ---
      setLoading(false); // Stop loading di tombol
      setShowSuccess(true); // Munculin layar sukses
      
      // Tahan 2.5 detik biar user baca tulisan, baru pindah
      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);

    } catch (err) {
      setError(err.response?.data?.message || 'Gagal daftar, coba lagi!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative overflow-hidden font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* 3. KOMPONEN LAYAR SUKSES */}
      <SuccessScreen 
        isOpen={showSuccess} 
        message="AKUN BERHASIL DIBUAT! 🎉" 
        subMessage="Sedang menyiapkan mental anda untuk melihat kenyataan..."
      />

      {/* ... (SISA KODE SAMA KAYAK SEBELUMNYA: BG EFFECT, LINK HOME, DLL) ... */}
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-yellow-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[120px] animate-pulse delay-75" />
      </div>

      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition z-20">
        <FaArrowLeft /> <span className="text-sm font-bold">Kembali ke Home</span>
      </Link>

      <div className="relative z-10 bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-yellow-500">
            Daftar Dulu.
          </h1>
          <p className="text-gray-400 text-sm mt-2">Biar jejak uangmu terlacak jelas.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Username</label>
            <input type="text" name="username" className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-yellow-500" placeholder="King Hapis" value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-yellow-500" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Password</label>
            <input type="password" name="password" className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-yellow-500" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 shadow-[0_0_20px_-5px_rgba(234,179,8,0.5)]">
            {loading ? 'Lagi diproses...' : 'Gas Daftar 🚀'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Udah punya akun?{' '}
          <Link to="/login" className="text-yellow-500 hover:underline font-bold">
            Login aja
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;