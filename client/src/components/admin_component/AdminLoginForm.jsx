import React, { useState } from 'react';
import axiosInstance from '../../utils/axios.helper.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentAdmin } from '../../store/Adminstate/adminSlice.js';


const AdminLoginForm = () => {
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setadminPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleAdminLogin = async (event) => {
    event.preventDefault();
   try{
    
    if(!adminName || !adminPassword){
      console.log("AdminName or adminPassword Not found");
    } 
    const response = await axiosInstance.post('/admin/login', {adminName,adminPassword});
    console.log('Admin Login successful:', response.data);

    dispatch(setCurrentAdmin(response.data.admin)); // here i am setting the current Admin 
    navigate('/admin')
    
   } catch(error){
    console.log("Error in AdminLogin->",error);
   }
  };


  return (
    <form onSubmit={handleAdminLogin} className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={adminName}
        onChange={(e) => setAdminName(e.target.value)}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        type="adminPassword"
        placeholder="adminPassword"
        value={adminPassword}
        onChange={(e) => setadminPassword(e.target.value)}
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
