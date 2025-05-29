import React, { useState } from 'react';

const AdminLoginForm = () => {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminLogin = (event) => {
    event.preventDefault();
    // Placeholder validation logic for admin login
    if (adminUsername === 'admin@example.com' && adminPassword === 'admin123') {
      alert('Admin login successful!');
    } else {
      alert('Invalid admin credentials.');
    }
  };

  return (
    <form onSubmit={handleAdminLogin} className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={adminUsername}
        onChange={(e) => setAdminUsername(e.target.value)}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        type="submit"
        className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Admin Login
      </button>
    </form>
  );
};

export default AdminLoginForm;
