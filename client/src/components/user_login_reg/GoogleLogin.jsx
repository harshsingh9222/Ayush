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
        className="flex items-center justify-center gap-2 w-full border-1 border-gray-300 hover:border-green-600 py-2 rounded hover:shadow-lg transition-shadow duration-200"
      >
        <img width="24" height="24" src="https://img.icons8.com/fluency/48/google-logo.png" alt="google-logo"/>
        Continue with Google
      </button>
    </div>
  );
};

export default GoogleLogin;
