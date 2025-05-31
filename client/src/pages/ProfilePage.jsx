import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigate = useNavigate();
  const { status, userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!status) {
      navigate("/login");
    }
  }, [status, navigate]);

  if (!userData) return null;

  return (
    <div style={styles.container}>
      {/* User Icon */}
      <div style={styles.avatarWrapper}>
        {userData.image ? (
          <img src={userData.image} alt="User" style={styles.avatar} />
        ) : (
          <div style={styles.defaultIcon}>👤</div>
        )}
      </div>

      {/* Info */}
      <div style={styles.info}>
        <p><strong>Role:</strong> User</p>
        <p><strong>Email:</strong> {userData.email || "Not Provided"}</p>
        <p><strong>Username:</strong> {userData.username}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  avatarWrapper: {
    marginBottom: '20px'
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
    backgroundColor: '#ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '50px'
  },
  info: {
    textAlign: 'center',
    fontSize: '18px',
    lineHeight: '1.6'
  }
};

export default ProfilePage;
