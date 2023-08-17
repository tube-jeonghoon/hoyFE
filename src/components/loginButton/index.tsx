import React, { useState } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function LoginButton() {
  const [userInfo, setUserInfo] = useState({ givenName: '', imageUrl: '' });

  // const onSuccess = async (res: any) => {
  //   console.log('Login success!');
  // };

  // const onFailure = () => {
  //   console.log('Login failed!');
  // };

  const googleSocialLogin = useGoogleLogin({
    scope: 'email profile',
    onSuccess: async ({ code }) => {
      axios
        .post('http://localhost:8000/api/auth/google/callback', { code })
        .then(({ data }) => {
          console.log(data);
        });
    },
    onError: errorResponse => {
      console.error(errorResponse);
    },
    flow: 'auth-code',
  });

  return (
    <div id="loginButton">
      {/* <GoogleLogin
        onSuccess={onSuccess}
        onError={onFailure}
        // useOneTap
        ux_mode="redirect"
        login_uri={`http://localhost:8000/api/auth/google/callback`}
        shape="pill"
      /> */}

      <button onClick={googleSocialLogin}>Google Button</button>

      {/* {userInfo.imageUrl && (
        <div>
          <img src={userInfo.imageUrl} alt="Profile" />
          <p>{userInfo.givenName}</p>
        </div>
      )} */}
    </div>
  );
}

export default LoginButton;
