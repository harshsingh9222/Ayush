import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { performLogout } from '../store/authActions';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.auth.status);
  const user = useSelector(state => state.auth.userData);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(performLogout());
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="bg-[rgb(85,126,160)] text-white shadow-md relative">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          AYUSH Startups
        </Link>

        {/* Mobile Login Button - visible when NOT logged in */}
        {!isLoggedIn && (
          <Link
            to="/login"
            className="md:hidden absolute right-16 top-4 bg-green-500 hover:bg-green-600 px-4 py-1 rounded-full text-sm z-10"
          >
            Login
          </Link>
        )}

        {/* Hamburger Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none z-20"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 items-center font-medium text-md">
          <li><Link to="/work" className="hover:text-gray-200">Works</Link></li>
          <li><Link to="/home" className="hover:text-gray-200">Home</Link></li>
          <li><Link to="/vision" className="hover:text-gray-200">Vision</Link></li>
          <li><Link to="/about" className="hover:text-gray-200">About</Link></li>
          <li><Link to="/contact" className="hover:text-gray-200">Contact</Link></li>

          {isLoggedIn ? (
            <div className="ml-4 flex items-center space-x-4 bg-white text-black px-4 py-1 rounded-full shadow-sm">
              <span className="text-sm font-semibold">Hi, {user?.username}</span>
              <Link to="/profile" className="text-blue-600 hover:underline text-sm">Profile</Link>
              <Link to="/dashboard" className="text-blue-600 hover:underline text-sm">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <li>
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-full text-sm"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[rgb(85,126,160)] px-4 pb-4 z-10">
          <ul className="flex flex-col space-y-3 font-medium">
            <li><Link to="/work" onClick={toggleMenu}>Works</Link></li>
            <li><Link to="/home" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/vision" onClick={toggleMenu}>Vision</Link></li>
            <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
            <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>

            {isLoggedIn && (
              <>
                <li className="pt-2 border-t border-gray-300">Hi, {user?.username}</li>
                <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>
                <li><Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link></li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-full"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
