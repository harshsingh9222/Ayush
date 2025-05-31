import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin.jsx';
import axiosInstance from '../../utils/axios.helper.js'; 
import {login as authLogin } from '../../store/authSlice.js'
import { useDispatch } from 'react-redux';

const LocalLogin = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/auth/login', loginData);
      console.log('Login successful:', response.data);
      // Handle successful login (e.g., store token, redirect, etc.)
    
      // const accessToken = `Bearer ${response.data.token}`;
      // localStorage.setItem('access_token', accessToken);
      // axiosInstance.defaults.headers.common['Authorization'] = accessToken;
      
      dispatch(authLogin(response.data.user)); 
      navigate('/home')
     
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6">User Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 transition duration-200"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 transition duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
      </form>
      {/* Alternative Google Login */}
      <div className="mt-6">
        <GoogleLogin />
      </div>
    </div>
  );
};

export default LocalLogin;
