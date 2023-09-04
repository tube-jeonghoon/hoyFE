import React from 'react';
import Image from 'next/image';
import defaultUser from '../../../public/img/defaultUser.png';
import cancel from '../../../public/img/cancel.svg';
import { useRecoilState } from 'recoil';
import { currentUserDataState } from '@/store/atom/userStatusState';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const AccountSettings = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserDataState);

  const logoutHandler = () => {
    const confirm = window.confirm('로그아웃 하시겠습니까?');
    if (!confirm) return;

    // 로그아웃 로직
    Cookies.remove('ACCESS_KEY');
    Cookies.remove('REFRESH_KEY');
    router.push('/login');
  };

  return (
    <div className="text-black flex flex-col gap-[1.5rem]">
      <div className="font-bold leading-[1.6rem]">내 프로필</div>
      <div className="flex justify-between">
        <div className="border-[#DFE0E8] rounded-[1.25rem] w-[3.75rem] h-[3.75rem]">
          <Image src={defaultUser} alt="defaultUser" />
        </div>
        <div className="flex flex-col gap-[0.62rem]">
          <div className="text-[0.875rem] font-bold">나의 이름</div>
          <div
            className="w-[14.8rem] py-[0.25rem] px-[0.75rem] flex gap-[0.62rem]
            border-[1px] border-[#DFE0E8] rounded-[0.5rem] justify-between items-center"
          >
            <input
              className="text-[0.875rem] text-gray-3 focus:outline-none focus:text-black w-full"
              type="text"
              placeholder={currentUser.nickname}
            />
            <Image src={cancel} alt="cancel" />
          </div>
          <div
            className="flex justify-end cursor-pointer"
            onClick={logoutHandler}
          >
            <div className="text-[0.75rem] text-[#9092A0]">로그아웃</div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default AccountSettings;
