import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';   
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // <--- 1. Panggil Pemain Inti
import History from './pages/History'; // Import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Depan (Public) */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Halaman Dashboard (Protected) */}
        {/* 2. Pasang di sini, jangan pake DashboardDummy lagi */}
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;