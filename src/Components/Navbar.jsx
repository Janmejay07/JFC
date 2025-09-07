import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut, Settings } from 'lucide-react';
import { API_ENDPOINTS } from '../lib/config'; 

const NavLink = ({ text, to, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="relative flex items-center px-4 py-2 rounded-lg text-white/90 hover:text-white transition-all duration-300 hover:bg-white/10 group"
  >
    <span className="font-semibold text-sm">{text}</span>
    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
  </Link>
);

const DropdownItem = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/10 focus:outline-none transition-colors duration-200 rounded-lg mx-2"
  >
    {icon}
    <span className="ml-3 font-medium">{text}</span>
  </button>
);

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [user, setUser] = useState({ name: '', image: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        setUser({
          name: storedUser.name || 'W',
          image: storedUser.image || '',
        });
        setIsAdmin(storedUser.isAdmin || false);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogin = () => navigate('/login');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setLoginMessage('Logged out successfully!');
    setTimeout(() => setLoginMessage(''), 3000);
    navigate('/');
  };

  return (
    <nav className="relative bg-gradient-primary backdrop-blur-lg bg-opacity-90 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          {/* ✅ Logo */}
          <div
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="rounded-full bg-gradient-primary shadow-primary transform group-hover:scale-110 transition-all duration-300 overflow-hidden">
              <img
                src={API_ENDPOINTS.LOGO_URL}
                alt="JFC Logo"
                className="h-14 w-16 object-cover rounded-full"
                onError={(e) => {
                  console.error('Logo failed to load:', API_ENDPOINTS.LOGO_URL);
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
              JFC
            </span>
          </div>

          {/* Menu Button (Mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Navbar Links */}
          <div
            className={`absolute top-full left-0 w-full rounded-lg md:bg-transparent md:static md:flex md:items-center md:justify-center md:space-x-3 space-y-3 md:space-y-0 py-4 md:py-0 px-6 md:px-0 transition-all duration-300 ${
              isMenuOpen
                ? 'block bg-gradient-primary'
                : 'hidden'
            }`}
          >
            {['Home', 'Squad', 'Stats', 'Gallery', 'Contact Us'].map((page) => (
              <NavLink
                key={page}
                text={page}
                to={`/${page.toLowerCase().replace(' ', '')}`}
                onClick={() => setIsMenuOpen(false)}
              />
            ))}
          </div>

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              className="hidden md:block px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 font-semibold border border-white/30 hover:border-white/50"
            >
              Login
            </button>
          ) : (
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none group"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden border-2 border-secondary-400 shadow-lg transform group-hover:scale-105 transition-all duration-300 bg-primary-600 text-white text-xl font-bold">
                  {user.image ? (
                    <img
                      src={user.image.startsWith('http') ? user.image : `${API_ENDPOINTS.BASE_URL}/${user.image}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-white transition-transform duration-300 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-gradient-primary rounded-xl shadow-2xl py-2 text-white border border-primary-700/30 backdrop-blur-xl">
                  <DropdownItem
                    icon={<Settings className="h-4 w-4" />}
                    text="Profile Settings"
                    onClick={() => navigate('/profile')}
                  />
                  <DropdownItem
                    icon={<LogOut className="h-4 w-4" />}
                    text="Logout"
                    onClick={handleLogout}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Login Message */}
      {loginMessage && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-success text-white py-2 px-4 rounded-lg shadow-lg">
          {loginMessage}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
