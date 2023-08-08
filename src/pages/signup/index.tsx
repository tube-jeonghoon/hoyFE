import { useRouter } from 'next/router';
import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordConfirmInput, setPasswordConfirmInput] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (passwordInput !== passwordConfirmInput) {
      setMessage('비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // axios를 사용하여 회원가입 요청 보내기
      const response = await axios.post('http://localhost:8000/api/signup', {
        emailInput,
        passwordInput,
      });

      // 회원가입 성공시 처리 로직(레디렉션 등)을 추가하세요.
      router.push('/login');
      console.log(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="max-w-[1440px]">
      <h1 className="w-full text-[1.6rem] flex justify-center">회원가입</h1>
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
        <div className="flex border boder-2 w-[18rem]">
          <label htmlFor="passwordConfirm">비밀번호 확인: </label>
          <input
            type="password"
            id="passwordConfirm"
            value={passwordConfirmInput}
            onChange={e => setPasswordConfirmInput(e.target.value)}
            required
          />
        </div>
        {message && <p className="text-[#ff1919]">{message}</p>}
        <button className="mt-2 border-2 px-[2rem]" type="submit">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
