import React, { useState } from 'react';
import LocalLogin from '../components/user_login_reg/LocalLogin';
import Register from '../components/user_login_reg/Register';
import AdminLoginForm from '../components/admin_component/AdminLoginForm';

const LoginPage = () => {
  const [formType, setFormType] = useState('user'); // 'user', 'admin', 'register'

  const renderForm = () => {
    if (formType === 'user') {
      return (
        <>
          <LocalLogin />
        </>
      );
    } else if (formType === 'admin') {
      return (
        <div className="admin-login-form bg-white shadow p-6 rounded w-96 mx-auto">
          {/* Your AdminLoginForm component */}
          <AdminLoginForm />
        </div>
      );
    } else if (formType === 'register') {
      return <Register />;
    }
  };

  return (
    <div className="py-10">
      <div className="flex justify-center space-x-4 mb-6">
        <button onClick={() => setFormType('user')} className={`px-4 py-2 ${formType === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200'} rounded`}>
          User Login
        </button>
        <button onClick={() => setFormType('admin')} className={`px-4 py-2 ${formType === 'admin' ? 'bg-green-500 text-white' : 'bg-gray-200'} rounded`}>
          Admin Login
        </button>
        <button onClick={() => setFormType('register')} className={`px-4 py-2 ${formType === 'register' ? 'bg-green-500 text-white' : 'bg-gray-200'} rounded`}>
          Register
        </button>
      </div>
      {renderForm()}
    </div>
  );
};

export default LoginPage;
