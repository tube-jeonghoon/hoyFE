import React, { useState } from 'react';
import { VscChevronDown } from 'react-icons/vsc';

const NavBar = () => {
  const [userName, setUserName] = useState('전정훈');

  return (
    <div className="w-full fixed top-0">
      <div className="p-[3.75rem] pb-[2.5rem]">
        <div className="text-gray-5">{userName} 님의 투두리스트</div>
        <div className="flex items-center text-[1.625rem] font-bold">
          <div>2023년 8월</div>
          <button className="ml-[0.3rem]">
            <VscChevronDown />
          </button>
        </div>
      </div>
      <div className="border-[0.015rem] border-[#F7F8FA]">{''}</div>
    </div>
  );
};

export default NavBar;
