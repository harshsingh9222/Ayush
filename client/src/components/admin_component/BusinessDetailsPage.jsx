import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../utils/axios.helper';
import { getCurrentAdmin } from '../../hooks/getCurrentAdmin';

function BusinessDetailsPage() {
  const { businessId } = useParams();
const [business, setBusiness] = useState(null);
const [representativeId, setRepresentativeId] = useState(null);
const dispatch = useDispatch();

const pendingBusinesses = useSelector(
  (state) => state.admin.currentAdminData.pendingBusinesses || []
);


// here i am writing the logic to get the current representative of the business
useEffect(() => {
  if (pendingBusinesses.length > 0) {
    const found = pendingBusinesses.find(
      (b) => String(b._id) === String(businessId)
    );
    if (found) {
      setBusiness(found);
      if (found.representative?._id) {
        setRepresentativeId(found.representative._id);
      }
    } else {
      setBusiness(null);
      setRepresentativeId(null);
    }
  }
}, [pendingBusinesses, businessId]);


  const repDocFields = ['addressProofPic', 'aadharPic', 'panPic'];
  const businessDocFields = [
    'aoa',
    'bankPassbook',
    'bankStatement',
    'businessContinuityProof',
    'businessProof',
    'moa',
    'ownershipProof',
    'partnershipDeed'
  ];

  useEffect(() => {
    if (pendingBusinesses.length > 0) {
      const found = pendingBusinesses.find(
        (b) => String(b._id) === String(businessId)
      );
      if (found) {
        setBusiness(found);
      } else {
        setBusiness(null);
      }
    }
  }, [pendingBusinesses, businessId, dispatch]);

  const handleApproval = (index, status) => {
    axiosInstance
      .post(`/admin/business/${businessId}/verify`, {
        index,
        status,
      })
      .then(() => {
        alert(`Document ${index} ${status}`);
        window.location.reload();
        dispatch(getCurrentAdmin());
        
      })
      .catch((err) => {
        console.error('Verification error', err);
      });
  };

  // here i am writing the logic to update the representative

  const handleApprovalRepresentative = (index, status) => {
    axiosInstance
      .post(`/admin/representative/${representativeId}/verify`, {
        index,
        status,
      })
      .then(() => {
        alert(`Document ${index} ${status}`);
        window.location.reload();
        dispatch(getCurrentAdmin());
        
      })
      .catch((err) => {
        console.error('Verification error', err);
      });
  };

  if (business === null) {
    return (
      <div className="p-6">
        <p className="text-red-500">Business with ID {businessId} not found in pending list.</p>
      </div>
    );
  }

  const representative = business.representative || {};
  const repStatusDocs = representative.statusDocs || [];
  const businessStatusDocs = business.statusDocs || [];

  return (
    <div className="p-6 space-y-6">
      {/* Representative Section */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-2">Representative Details</h2>
        <p><strong>Name:</strong> {representative.name || 'N/A'}</p>
        <p><strong>Email:</strong> {representative.email || 'N/A'}</p>
        <p><strong>Mobile No:</strong> {representative.mobileNo || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> {representative.dob ? new Date(representative.dob).toLocaleDateString() : 'N/A'}</p>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Representative Documents</h3>
          {repDocFields.map((docField, index) => (
            <div key={docField} className="bg-gray-100 p-4 rounded shadow-md mb-2">
              <p className="font-semibold capitalize">{docField.replace(/Pic$/, '')}:</p>
              {representative[docField] ? (
                <>
                  <a
                    href={representative[docField]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Document
                  </a>
                  <div className="mt-2">
                    {repStatusDocs[index] === 2 ? (
                      <>
                        <button
                          onClick={() => handleApprovalRepresentative(index, 'approve')}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded mr-2 transition-colors duration-200 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApprovalRepresentative(index, 'reject')}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-colors duration-200 cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    ) : repStatusDocs[index] === 1 ? (
                      <span className="text-green-600 font-semibold">Approved</span>
                    ) : repStatusDocs[index] === 0 ? (
                      <span className="text-red-600 font-semibold">Rejected</span>
                    ) : (
                      <span className="text-gray-500">Status Unknown</span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-red-500">No document uploaded</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Business Details Section */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Business Details</h2>
        <p><strong>Name:</strong> {business.businessName || 'N/A'}</p>
        <p><strong>Email:</strong> {business.email || 'N/A'}</p>
        <p><strong>Mobile No:</strong> {business.mobileNo || 'N/A'}</p>
        <p><strong>Registration Number:</strong> {business.registrationNumber || 'N/A'}</p>
        <p><strong>Sectors:</strong> {business.sectors?.join(', ') || 'N/A'}</p>
        <p><strong>Address:</strong> {business.addressLine1 || ''}{business.addressLine2 ? `, ${business.addressLine2}` : ''}</p>
        <p><strong>Village/Town:</strong> {business.villageTown || 'N/A'}</p>
        <p><strong>Tehsil:</strong> {business.tehsil || 'N/A'}</p>
        <p><strong>Post:</strong> {business.post || 'N/A'}</p>
        <p><strong>District:</strong> {business.district || 'N/A'}</p>
        <p><strong>State:</strong> {business.state || 'N/A'}</p>
        <p><strong>Postal Code:</strong> {business.postalCode || 'N/A'}</p>
        <p><strong>Objectives:</strong> {business.objectivesOfbusiness || 'N/A'}</p>
        <p><strong>Account Holder Name:</strong> {business.accountHolderName || 'N/A'}</p>
        <p><strong>Bank Name:</strong> {business.bankName || 'N/A'}</p>
        <p><strong>IFSC Code:</strong> {business.ifscCode || 'N/A'}</p>
        <p><strong>Account Number:</strong> {business.bankAccountNumber || 'N/A'}</p>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Business Documents</h3>
          {businessDocFields.map((docField, index) => (
            <div key={docField} className="bg-gray-100 p-4 rounded shadow-md mb-2">
              <p className="font-semibold capitalize">{docField}:</p>
              {business[docField] ? (
                <>
                  <a
                    href={business[docField]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Document
                  </a>
                  <div className="mt-2">
                    {businessStatusDocs[index] === 2 ? (
                      <>
                        <button
                          onClick={() => handleApproval(index, 'approve')}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded mr-2 transition-colors duration-200 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(index, 'reject')}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-colors duration-200 cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    ) : businessStatusDocs[index] === 1 ? (
                      <span className="text-green-600 font-semibold">Approved</span>
                    ) : businessStatusDocs[index] === 0 ? (
                      <span className="text-red-600 font-semibold">Rejected</span>
                    ) : (
                      <span className="text-gray-500">Status Unknown</span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-red-500">No document uploaded</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BusinessDetailsPage;
