import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const Login = () => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // axios를 사용하여 로그인 요청 보내기
      const response = await axios.post(
        'http://localhost:8000/api/login',
        {
          emailInput,
          passwordInput,
        },
        { withCredentials: true },
      );

      // 로그인 성공시 처리 로직(레디렉션 등)을 추가하세요.
      router.push('/');
      console.log(response.data);
    } catch (error) {
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
        <button className="mt-2 border-2 px-[2rem]" type="submit">
          로그인
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
