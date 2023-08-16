import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import hoyImg from '../../../public/img/hoy.png';
import googleLoginBtn from '../../../public/img/googleLoginBtn.png';
import GoogleLoginTest from 'react-google-login';
import axios from 'axios';

interface User {
  name: string;
  email: string;
  imageUrl: string;
}

const GoogleLogin = () => {
  const [user, setUser] = useState<User | null>(null);
  const onSuccess = (res: any) => {
    const fullName = res.profileObj.familyName + res.profileObj.givenName;
    console.log(res.profileObj);

    console.log(fullName);
    console.log(res.profileObj.imageUrl);
    console.log(res.profileObj.email);

    setUser({
      name: fullName,
      email: res.profileObj.email,
      imageUrl: res.profileObj.imageUrl,
    });
    console.log(user);
  };

  const fetchUser = async (user: User) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/auth/login',
        user,
      );

      console.log(response);
    } catch (error) {
      console.log(error);
      console.log("fetchUser's error");
    }
  };

  const onFailure = (error: any) => {
    console.log(error);
    console.log('btn failed');
  };

  useEffect(() => {
    if (user !== null) {
      fetchUser(user);
    }
  }, [user]);

  return (
    <div className="w-screen h-screen">
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
        <div>
          <div className="text-gray-5 text-center leading-[1.6rem] mb-[0.5rem]">
            <div>very simple, very clear</div>
            <div>투명한 업무공유의 시작</div>
          </div>
          <div className="mb-[3.75rem] flex justify-center">
            <Image src={hoyImg} alt="hoy" />
          </div>
          <div
            className="mb-[1rem] gap-[0.75rem] flex justify-center items-center p-[0.75rem]
            border-[1px] rounded-[0.5rem] cursor-pointer hover:bg-gray-1"
          >
            <div className="">
              <Image src={googleLoginBtn} alt="google" />
            </div>
            <div
              className="text-[1.25rem] leading-[2rem] font-bold text-black
              "
            ></div>
          </div>
          <div className="flex text-[0.75rem] text-gray-4">
            <div>회원가입 시 hoy의</div>&nbsp;
            <div className="font-bold">서비스 이용약간</div>
            <div>과</div>&nbsp;
            <div className="font-bold">개인정보 보호정책</div>
            <div>에 동의하게 됩니다.</div>
          </div>
          <GoogleLoginTest
            clientId="174462797558-14770qjh0l6u9nfflhnnpqnbso5hk8cd.apps.googleusercontent.com"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            buttonText="Google 로그인"
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleLogin;
