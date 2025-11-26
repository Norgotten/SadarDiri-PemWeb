import axios from 'axios';

// Bikin settingan pusat buat koneksi ke Backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // <-- Pastikan portnya sama kayak backendmu
});

// Settingan Otomatis (Interceptor):
// Setiap kali mau request ke backend, cek dulu "Apakah ada Token di saku?"
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ambil token dari penyimpanan browser
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Tempel token sebagai tiket masuk
  }
  return config;
});

export default api;