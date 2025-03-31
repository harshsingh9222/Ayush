import React from 'react';
import { Link } from 'react-router-dom';
import { Ayushlogo } from '../assets/images';

const Header = () => {
  return (
    <header className="bg-[rgb(85,126,160)] text-white py-4">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold">AYUSH Startups</div>
        <ul className="flex space-x-6">
          <li>
            <Link to="/home" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/vision" className="hover:underline">
              Vision
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </li>
        </ul>
      </nav>
      {/* <div id="logoImg" className="text-left mt-2">
        <img
          src={Ayushlogo}
          alt="AYUSH Logo"
          className="mx-auto max-h-16"
        />
      </div> */}
    </header>
  );
};

export default Header;
