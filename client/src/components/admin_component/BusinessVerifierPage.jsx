import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios.helper';
import { useSelector } from 'react-redux';

function BusinessVerifierPage() {
    const pendingBusinesses = useSelector((state) => state.admin.currentAdminData).pendingBusinesses;
    console.log("Printing the pending Business->",pendingBusinesses);
  // const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const navigate = useNavigate();

//   useEffect(() => {
//     axiosInstance.get('/admin/pending-businesses')
//       .then(res => {
//         // console.log("Here i am->",res.data);
//         setPendingBusinesses(res.data.data);
//       })
//       .catch(err => {
//         console.error("Error fetching businesses", err);
//       });
//   }, []);

  const handleCardClick = (businessId) => {
    navigate(`/admin/business/${businessId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Businesses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingBusinesses.map((business) => (
          <div
            key={business._id}
            className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg"
            onClick={() => handleCardClick(business._id)}
          >
            <h3 className="text-lg font-semibold">{business.businessName}</h3>
            <p><strong>Reg No:</strong> {business.registrationNumber}</p>
            <p><strong>Email:</strong> {business.email}</p>
            <p><strong>Mobile:</strong> {business.mobileNo}</p>
            <p><strong>Sectors:</strong> {business.sectors?.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BusinessVerifierPage;
