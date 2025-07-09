import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigate = useNavigate();

  const { status, userData } = useSelector((state) => state.auth);
  const { representativeData } = useSelector((state) => state.representative);
  const { businessStatus, businessData } = useSelector((state) => state.business);

  useEffect(() => {
    if (!status) {
      navigate("/login");
    }
  }, [status, navigate]);

  if (!userData) return null;

  return (
    <div style={styles.container}>
      {/* Profile Picture */}
      <div style={styles.avatarWrapper}>
        {userData.image ? (
          <img src={userData.image} alt="User" style={styles.avatar} />
        ) : (
          <div style={styles.defaultIcon}>👤</div>
        )}
      </div>

      {/* Basic User Info */}
      <div style={styles.card}>
        <h2 style={styles.heading}>Account Overview</h2>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email || "Not Provided"}</p>
        <p><strong>Role:</strong> User</p>
      </div>

      {/* Representative */}
      {representativeData && (
        <div style={styles.card}>
          <h2 style={styles.heading}>Representative Summary</h2>
          <p><strong>Name:</strong> {representativeData.name || 'N/A'}</p>
          <p><strong>Position:</strong> {representativeData.position || 'N/A'}</p>
          <p><strong>State:</strong> {representativeData.state || 'N/A'}</p>
          <p><strong>Email:</strong> {representativeData.email || 'N/A'}</p>
        </div>
      )}

      {/* Business */}
      {businessData && (
        <div style={styles.card}>
          <h2 style={styles.heading}>Business Summary</h2>
          <p><strong>Name:</strong> {businessData.businessName || 'N/A'}</p>
          <p><strong>Location:</strong> {`${businessData.state || 'N/A'}, ${businessData.district || ''}`}</p>
          <p>
            <strong>Sectors:</strong>{" "}
            {businessData?.sectors?.length > 0 ? businessData.sectors.join(", ") : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: 'sans-serif',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatarWrapper: {
    marginBottom: '25px'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  defaultIcon: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#d1d5db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '50px'
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '600px',
    marginBottom: '20px'
  },
  heading: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#4f46e5',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '4px'
  }
};

export default ProfilePage;
