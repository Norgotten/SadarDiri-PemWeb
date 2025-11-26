import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaHistory, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaHome /> },
    { path: '/history', name: 'Riwayat Pengeluaran', icon: <FaHistory /> }, // GANTI INI
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 h-screen fixed left-0 top-0 p-6 z-50">
      <div className="mb-10 flex items-center gap-2">
        <h1 className="text-2xl font-extrabold text-yellow-500 tracking-tighter">
          Sadar<span className="text-white">Diri.</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={handleLogout} 
        className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-xl transition mt-auto"
      >
        <FaSignOutAlt />
        <span>Kabur (Logout)</span>
      </button>
    </div>
  );
};

export default Sidebar;