import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/profile': 'Profile',
};

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentTitle =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith('/projects/') ? 'Project Details' : 'Workspace');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0c0c0c]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-white tracking-tight">
              {currentTitle}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* User dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1 pr-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/[0.04] transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-brand-500/10">
                {getInitials(user?.name)}
              </div>
              <span className="hidden sm:block text-xs font-medium text-gray-300">
                {user?.name || 'User'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#121212] rounded-xl shadow-2xl border border-white/[0.08] py-1.5 animate-slideUp z-50">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-xs font-semibold text-white">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
