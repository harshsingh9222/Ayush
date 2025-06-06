import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import axiosInstance from '../../utils/axios.helper';
import { login as authLogin } from '../../store/authSlice';

const Register = () => {
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/auth/register', registerData);
      console.log('Registration successful:', response.data);

      // Automatically log in the user
      dispatch(authLogin(response.data.user));

      // Optional: set access token in localStorage or axios headers
      // const accessToken = `Bearer ${response.data.token}`;
      // localStorage.setItem('access_token', accessToken);
      // axiosInstance.defaults.headers.common['Authorization'] = accessToken;

      // Redirect to home
      navigate('/home');

    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      <form onSubmit={handleRegisterSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-1">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 transition duration-200"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 transition duration-200"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500 transition duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
      </form>
      <div className="mt-6">
        <GoogleLogin />
      </div>
    </div>
  );
};

export default Register;
