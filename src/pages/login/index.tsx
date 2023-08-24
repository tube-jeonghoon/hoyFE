import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import hoyImg from '../../../public/img/hoy.png';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';

const Login = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ givenName: '', imageUrl: '' });
  const [loginResponse, setLoginResponse] = useState(null);

  const fetchUniqueToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uniqueToken = urlParams.get('uniqueToken');
    if (uniqueToken != null) {
      localStorage.setItem('uniqueToken', uniqueToken);
      console.log(uniqueToken);
    }
  };

  const sendInvitationAcceptance = async () => {
    const uniqueToken = localStorage.getItem('uniqueToken');
    const email = router.query.email;
    const accessToken = Cookies.get('ACCESS_KEY');
    console.log("✨ ➤ sendInvitationAcceptance ➤ uniqueToken:", uniqueToken);
    console.log("✨ ➤ sendInvitationAcceptance ➤ email:", email);
    try {
      if (uniqueToken && email) {
        await axios.post('https://api.hoy.im/api/workspace/accept-invitation', {
          uniqueToken,
          email,
        }, {
          headers: {
            Authorization: `${accessToken}`,
        }}
        )
      }
    } catch (error) {
      console.error('Error sending invitation acceptance:', error);
    }
    // if (uniqueToken && email) {
    //   try {
    //     await fetch('https://api.hoy.im/workspace/accept-invitation', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ uniqueToken, email }),
    //     });
    //     localStorage.removeItem('uniqueToken');
    //   } catch (error) {
    //     console.error('Error sending invitation acceptance:', error);
    //   }
    }

  // 이미 액세스 토큰을 가지고 있으면 /home으로 리다이렉팅
  useEffect(() => {
    if (Cookies.get('ACCESS_KEY')) {
      // router.push('/home');
    }
  }, []);

  useEffect(() => {
    const uniqueToken = localStorage.getItem('uniqueToken') || '';
    fetchUniqueToken();
  }, []);

  useEffect(() => {
    const uniqueToken = router.query.uniqueToken;
    console.log(uniqueToken);
  }, []);

  useEffect(() => {
    // 쿼리 파라미터에서 access_token 가져오기
    const accessToken = router.query.access_token;

    if (typeof accessToken === 'string') {
      console.log('Access Token:', accessToken);
      Cookies.set('ACCESS_KEY', accessToken);

      sendInvitationAcceptance();

      // window.location.href = '/home';
    }
  }, [router.query.access_token]);

  const loginCheck = () => {
    // const accessToken = Cookies.get('ACCESS_KEY');
    const accessToken = Cookies.get('ACCESS_KEY');

    console.log(accessToken);
    if (accessToken) {
      router.push('/home');
    }
  };

  useEffect(() => {
    // loginCheck();
  }, []);

  return (
    <div className="w-screen h-screen">
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
        <div className="">
          <div className="text-gray-5 text-center leading-[1.6rem] mb-[0.5rem]">
            <div>very simple, very clear</div>
            <div>투명한 업무공유의 시작</div>
          </div>
          <div className="mb-[3.75rem] flex justify-center">
            <Image src={hoyImg} alt="hoy" />
          </div>
          <div
            className="flex items-center justify-center mb-[1rem]"
            id="loginButton"
          >
            <GoogleLogin
              onSuccess={() => {
                console.log('Login Success');
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              ux_mode="redirect"
              login_uri={`https://api.hoy.im/api/auth/google/callback`}
            />

            {userInfo.imageUrl && (
              <div>
                <Image src={userInfo.imageUrl} alt="Profile" />
                <p>{userInfo.givenName}</p>
              </div>
            )}
          </div>
          <div className="flex text-[0.75rem] text-gray-4">
            <div>회원가입 시 hoy의</div>&nbsp;
            <div className="font-bold">서비스 이용약간</div>
            <div>과</div>&nbsp;
            <div className="font-bold">개인정보 보호정책</div>
            <div>에 동의하게 됩니다.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
