import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/apiClient';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/chat', label: 'Chatbot' },
  { to: '/videos', label: 'Videos' },
  { to: '/library', label: 'My Watched Videos' },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/user/me');
        const name = res.data?.name || 'User';
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff&size=128`;
        setUser({ name, avatar });
      } catch {
        setUser({ name: 'User', avatar: '' });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow sticky top-0 z-20 w-full">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Lore</span>
          <div className="hidden md:flex gap-2 ml-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1 rounded transition font-medium ${location.pathname.startsWith(link.to) ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition">
            {loading ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              <>
                <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border-2 border-blue-500" />
                <span className="text-gray-700 dark:text-gray-200 font-medium text-sm hidden sm:inline">{user?.name}</span>
              </>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-semibold transition"
          >
            Logout
          </button>
          <button
            className="md:hidden ml-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 pb-4">
          <div className="flex flex-col gap-2 mt-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded transition font-medium ${location.pathname.startsWith(link.to) ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700'}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 