import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Cookies from 'js-cookie';

const Login = () => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  /**
   * 로그인 요청 보내는 함수
   * @param e
   */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.BACKEND_SERVER}/auth/login`,
        {
          email: emailInput,
          password: passwordInput,
        },
        { withCredentials: true },
      );
      router.push('/');
      console.log(emailInput, passwordInput);
      const { data } = response;
      const decoded = jwtDecode(data.access_token);
      const accessExpirationDate = new Date(decoded.exp * 10000); // 10시간

      Cookies.set('ACCESS_KEY', data.access_token, {
        expires: accessExpirationDate,
      });
    } catch (error) {
      console.log(emailInput, passwordInput);
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="max-w-[1440px]">
      <h1 className="w-full text-[1.6rem] flex justify-center">로그인</h1>
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="flex border boder-2 w-[18rem]">
          <label htmlFor="email">이메일: </label>
          <input
            className="w-[12rem]"
            type="email"
            id="email"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            required
          />
        </div>
        <div className="flex border boder-2 w-[18rem]">
          <label htmlFor="password">비밀번호: </label>
          <input
            type="password"
            id="password"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            required
          />
        </div>
        {message && <p className="font-[#ff0000]">{message}</p>}
        <button className="mt-2 border-2 px-[2rem]" type="submit">
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
