import { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { z } from 'zod'; 
import SuccessScreen from '../components/SuccessScreen'; // Import Layar Sukses

// --- 1. SKEMA VALIDASI ZOD ---
const loginSchema = z.object({
  email: z.string().email("Format email salah, kurang '@' kali?"),
  password: z.string().min(1, "Password tolong diisi ya, jangan ngelamun."),
});

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // Error Global (Backend)
  const [fieldErrors, setFieldErrors] = useState({}); // Error Per Kolom (Zod)
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // State Layar Sukses
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Hapus error merah pas user mulai ngetik benerin
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    // --- 2. CEK VALIDASI ZOD DULU ---
    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const formattedErrors = {};
      validation.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message;
      });
      setFieldErrors(formattedErrors);
      setLoading(false);
      return; 
    }

    // --- 3. KIRIM KE BACKEND ---
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      // --- 4. SUKSES & ANIMASI ---
      setLoading(false);
      setShowSuccess(true); // Munculin Overlay Sukses
      
      // Tahan 2.5 detik biar kebaca, baru pindah
      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);

    } catch (err) {
      setError(err.response?.data?.message || 'Email atau Password salah!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative overflow-hidden font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* --- KOMPONEN LAYAR SUKSES --- */}
      <SuccessScreen 
        isOpen={showSuccess} 
        message="LOGIN SUKSES! 🔓" 
        subMessage="Membuka gerbang dimensi kekhilafan..."
      />

      {/* Background Efek */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-yellow-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[120px] animate-pulse delay-75" />
      </div>

      {/* Tombol Kembali */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition z-20">
        <FaArrowLeft /> <span className="text-sm font-bold">Kembali ke Home</span>
      </Link>

      <div className="relative z-10 bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-yellow-500 tracking-tighter">
            Sadar<span className="text-white">Diri.</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Aplikasi pencatat realita finansial.</p>
        </div>

        {/* Error Backend Global */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Input Email */}
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Email</label>
            <input 
              type="text" 
              name="email" 
              className={`w-full bg-gray-800 text-white border ${fieldErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 focus:outline-none focus:border-yellow-500 transition`}
              placeholder="Masukin email lo..."
              value={formData.email}
              onChange={handleChange}
            />
            {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              className={`w-full bg-gray-800 text-white border ${fieldErrors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 focus:outline-none focus:border-yellow-500 transition`}
              placeholder="Password rahasia..."
              value={formData.password}
              onChange={handleChange}
            />
            {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 shadow-[0_0_20px_-5px_rgba(234,179,8,0.5)]"
          >
            {loading ? 'Sabar...' : 'Masuk Masbro 🚀'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Belum punya akun?{' '}
          <Link to="/register" className="text-yellow-500 hover:underline font-bold">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;