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

function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(true);
  const representativeStatus = useSelector((state) => state.representative.status);
  const representativeData = useSelector((state) => state.representative.representativeData);

  useEffect(() => {
    getCurrentUser(dispatch)
    fetchCurrentRepresentative(dispatch)
    fetchBusiness(dispatch)
     .finally(() => setLoading(false));

  }, [dispatch]);



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
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/step" element={<Home />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/vision" element={<VisionPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<PageNotFound />} />
          <Route path="/work" element={<WorkPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
