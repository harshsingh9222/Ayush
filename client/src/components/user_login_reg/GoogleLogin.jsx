import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from '../../Api/googleCode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login as authLogin } from '../../store/authSlice';

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccess = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code);
        const user = result.data.user;

        console.log("Google user:", user);

        // Store token if provided (optional)
        // const accessToken = `Bearer ${result.data.token}`;
        // localStorage.setItem('access_token', accessToken);

        // Dispatch to Redux
        dispatch(authLogin(user));

        // Redirect to home
        navigate('/home');
      }
      console.log('Google auth result:', authResult);
    } catch (err) {
      console.error('Error while requesting Google code:', err);
    }
  };

  const onError = (error) => {
    console.error('Google login error:', error);
  };

const googleLogin = useGoogleLogin({
  onSuccess,
  onError,
  flow: 'auth-code',
});


  return (
    <div className="App">
      <button
        onClick={googleLogin}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
      >
        Continue with Google
      </button>
    </div>
  );
};

export default GoogleLogin;
