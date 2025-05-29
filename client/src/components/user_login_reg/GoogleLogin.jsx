import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from '../../Api/googleCode';

const GoogleLogin = () => {
  const onSuccess = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code);
        const { email, name, image } = result.data.user;
        console.log("result-data-user---", result.data.user);
      }
      console.log('Google auth result:', authResult);
    } catch (err) {
      console.error('Error while requesting google code:', err);
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
      <button onClick={googleLogin}>
        Continue with Google
      </button>
    </div>
  );
};

export default GoogleLogin;
