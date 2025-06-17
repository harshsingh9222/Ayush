import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import VisionPage from './pages/VisionPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import PageNotFound from './pages/PageNotFound';
import WorkPage from './pages/WorkPage';
import Home from './components/Step-Resistration/Home';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './hooks/getCurrentUser';
import { addRepresentative } from './store/representativeSlice';
import axiosInstance from './utils/axios.helper';
import { fetchCurrentRepresentative } from './hooks/getCurrentRepresentative';
import { fetchBusiness } from './hooks/getBusiness';
import ProfilePage from './pages/ProfilePage';
import CompanyDashboard from "./pages/CompanyDashboard"
import Fund from "./components/fund/Fund";
import FundsList from './components/fund/FundsList';
import ReviewSubmission from './components/fund/Steps/ReviewSubmission';
import AdminPage from './pages/AdminPage';
import { getCurrentAdmin } from './hooks/getCurrentAdmin';
import AdminRoute from './utils/AdminRoute';

function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(true);
  const representativeStatus = useSelector((state) => state.representative.status);
  const representativeData = useSelector((state) => state.representative.representativeData);
  const currentAdminStatus = useSelector((state)=> state.admin.currentAdminStatus);
  const currentAdminData = useSelector((state)=> state.admin.currentAdminData);


  useEffect(() => {
      getCurrentUser(dispatch)
      getCurrentAdmin(dispatch)
      fetchCurrentRepresentative(dispatch)
      fetchBusiness(dispatch)
       .finally(() => setLoading(false));
  }, [authStatus,dispatch]);

 console.log("Current Admin Status->",currentAdminStatus);
 console.log("Current Admin data from App.jsx->",currentAdminData);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-solid mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen">
      <Header />
      <main>
      <Routes>
 
  {currentAdminStatus ? (
    <>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/*" element={<Navigate to="/admin" replace />} />
    </>
  ) : (
    
    <>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/vision" element={<VisionPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/step" element={<Home />} />
      <Route path="/work" element={<WorkPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/dashboard" element={<CompanyDashboard />} />
      <Route path="/dashboard/funds" element={<FundsList />} />
      <Route path="/fund/:fundId/step/:stepNumber" element={<Fund />} />
      <Route path="/fund/:fundId/view" element={<ReviewSubmission readOnly={true} />} />
      <Route path="/fund" element={<Navigate to="/dashboard/funds" />} />

     
      <Route path="/admin" element={<Navigate to="/login" replace />} />
      <Route path="/*" element={<PageNotFound />} />
    </>
  )}
</Routes>

      </main>
    </div>
  );
}

export default App;
