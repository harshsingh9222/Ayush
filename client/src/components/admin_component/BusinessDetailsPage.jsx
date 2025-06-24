import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../utils/axios.helper';
import { getCurrentAdmin } from '../../hooks/getCurrentAdmin';

function BusinessDetailsPage() {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [representativeId, setRepresentativeId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionIndex, setRejectionIndex] = useState(null);
  const [rejectionType, setRejectionType] = useState('');
  const [query, setQuery] = useState('');
  const [timeline, setTimeline] = useState('');

  const dispatch = useDispatch();
  const pendingBusinesses = useSelector(
    (state) => state.admin.currentAdminData.pendingBusinesses || []
  );

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

  const handleApproval = (index, status) => {
    if (status === 'reject') {
      setRejectionIndex(index);
      setRejectionType('business');
      setShowRejectModal(true);
      return;
    }
    axiosInstance
      .post(`/admin/business/${businessId}/verify`, { index, status })
      .then(() => {
        alert(`Document ${index} ${status}`);
        window.location.reload();
        dispatch(getCurrentAdmin());
      })
      .catch((err) => console.error('Verification error', err));
  };

  const handleApprovalRepresentative = (index, status) => {
    if (status === 'reject') {
      setRejectionIndex(index);
      setRejectionType('representative');
      setShowRejectModal(true);
      return;
    }
    axiosInstance
      .post(`/admin/representative/${representativeId}/verify`, { index, status })
      .then(() => {
        alert(`Document ${index} ${status}`);
        window.location.reload();
        dispatch(getCurrentAdmin());
      })
      .catch((err) => console.error('Verification error', err));
  };

  const submitRejection = () => {
    if (!query || !timeline) {
      alert("Please enter both rejection reason and timeline.");
      return;
    }

    const payload = {
      index: rejectionIndex,
      status: 'reject',
      query,
      timeline,
    };

    const url =
      rejectionType === 'representative'
        ? `/admin/representative/${representativeId}/verify`
        : `/admin/business/${businessId}/verify`;

    axiosInstance
      .post(url, payload)
      .then(() => {
        alert(`Rejected with reason and timeline submitted.`);
        setShowRejectModal(false);
        setQuery('');
        setTimeline('');
        setRejectionIndex(null);
        window.location.reload();
        dispatch(getCurrentAdmin());
      })
      .catch((err) => console.error('Rejection submission error', err));
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
        {/* Business Info Rendered Here */}
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

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Reject Document</h2>
            <label className="block mb-2 font-semibold">Reason for Rejection:</label>
            <textarea
              className="w-full border p-2 rounded mb-4"
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter the reason for rejection"
            />
            <label className="block mb-2 font-semibold">Timeline (Deadline Date):</label>
            <input
              type="date"
              className="w-full border p-2 rounded mb-4"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded mr-2"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                onClick={submitRejection}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessDetailsPage;
