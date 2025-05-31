import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { performLogout } from '../store/authActions'; // your thunk
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const dispatch   = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.status);
  const user       = useSelector(state => state.auth.userData);
  const navigate=useNavigate()

  const handleLogout = () => {
    dispatch(performLogout());
    navigate('/')
  };

  return (
    <header className="bg-[rgb(85,126,160)] text-white py-4">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold">AYUSH Startups</div>
        <ul className="flex space-x-6 items-center">
          <li><Link to="/work"    className="hover:underline">Works</Link></li>
          <li><Link to="/home"    className="hover:underline">Home</Link></li>
          <li><Link to="/vision"  className="hover:underline">Vision</Link></li>
          <li><Link to="/about"   className="hover:underline">About</Link></li>
          <li><Link to="/contact" className="hover:underline">Contact</Link></li>

          {isLoggedIn ? (
            <>
              <li className="ml-4">Hello, {user.username}</li>
              <li>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className="px-3 py-1 bg-green-500 rounded hover:bg-green-600 transition"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
