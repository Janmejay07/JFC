import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut, Settings } from 'lucide-react';
import { API_ENDPOINTS } from './config';

const NavLink = ({ text, to, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="relative flex items-center px-4 py-2 rounded-lg text-white/90 hover:text-white transition-all duration-300 hover:bg-white/10 group"
  >
    <span className="font-medium">{text}</span>
    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
  </Link>
);

const DropdownItem = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800/30 focus:outline-none"
  >
    {icon}
    <span className="ml-3">{text}</span>
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

  // Use public folder (images are in public/logo.jpg)
  const logoUrl = '/logo.jpg';

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        setUser({
          name: storedUser.name || 'W',
          image: storedUser.image || '',
          isAdmin: storedUser.isAdmin || false 
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

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setLoginMessage('Logged out successfully!');
    setTimeout(() => setLoginMessage(''), 3000);
    navigate('/');
  };

  return (
    <nav className="relative bg-gradient-to-r from-blue-600 to-emerald-600 backdrop-blur-lg bg-opacity-90 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 shadow-lg transform group-hover:scale-110 transition-all duration-300">
              <img
                src={logoUrl}
                alt="JFC Logo"
                className="h-14 w-16 object-cover rounded-full"
                onError={(e) => {
                  console.error('Image failed to load:', logoUrl);
                  // Fallback: hide image and show text only
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
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

          {/* Navbar Links (Mobile & Desktop) */}
          <div
            className={`absolute top-full left-0 w-full rounded-lg  md:bg-transparent md:static md:flex md:items-center md:justify-center md:space-x-3 space-y-3 md:space-y-0 py-4 md:py-0 px-6 md:px-0 transition-all duration-300 ${
              isMenuOpen
                ? 'block bg-gradient-to-r from-blue-600 to-emerald-600'
                : 'hidden'
            }`}
          >
            <NavLink text="Home" to="/" onClick={() => setIsMenuOpen(false)} />
            <NavLink text="Squad" to="/squad" onClick={() => setIsMenuOpen(false)} />
            <NavLink text="Stats" to="/stats" onClick={() => setIsMenuOpen(false)} />
            <NavLink text="Gallery" to="/gallery" onClick={() => setIsMenuOpen(false)} />
            <NavLink text="Contact Us" to="/contactus" onClick={() => setIsMenuOpen(false)} />
          </div>

          {/* Authentication Section */}
          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              className="hidden md:block px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Login
            </button>
          ) : (
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none group"
              >
                {/* Profile Picture or Fallback */}
                <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden border-2 border-emerald-400 shadow-lg transform group-hover:scale-105 transition-all duration-300 bg-blue-600 text-white text-xl font-bold">
                  {user.image ? (
                    <img
                      src={user.image.startsWith('http') ? user.image : `${API_ENDPOINTS.BASE_URL}/${user.image}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if profile image fails
                        e.target.style.display = 'none';
                      }}
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

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-gradient-to-b from-blue-600 to-emerald-600 rounded-xl shadow-2xl py-2 text-white border border-blue-700/30 backdrop-blur-xl">
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
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
          {loginMessage}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
