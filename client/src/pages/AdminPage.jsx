import React from 'react';
import { useSelector } from 'react-redux';

// import BusinessVerifierPage from './BusinessVerifierPage';
// import FundVerifierPage from './FundVerifierPage';
// import FundGranterPage from './FundGranterPage';
import PageNotFound from './PageNotFound';
import BusinessVerifierPage from '../components/admin_component/BusinessVerifierPage';
import FundVerifierPage from '../components/admin_component/FundVerifierPage';
import FundGranterPage from '../components/admin_component/FundGranterPage';

function AdminPage() {
  const currentAdminData = useSelector((state) => state.admin.currentAdminData);
  const currentAdminStatus = useSelector((state) => state.admin.currentAdminStatus);

  if (!currentAdminStatus || !currentAdminData) {
    return <PageNotFound />;
  }

  switch (currentAdminData.adminName) {
    case 'BusinessVerifier':
      return <BusinessVerifierPage />;
    case 'FundVerifier':
      return <FundVerifierPage/>;
    case 'FundGranter':
      return <FundGranterPage />;
    default:
      return <PageNotFound />;
  }
}

export default AdminPage;
