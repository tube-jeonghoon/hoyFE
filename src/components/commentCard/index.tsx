import Image from 'next/image';
import React from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import userProfile from '../../../public/img/userProfile.png';

const CommentCard = () => {
  return (
    <div>
      <div className="flex gap-[0.62rem] w-full justify-between items-center mb-[0.62rem]">
        <div className="flex gap-[0.62rem] items-center">
          <div className="rounded-[0.5rem]">
            <Image src={userProfile} alt="유저프로필" />
          </div>
          <div className="text-black text-[0.875rem]">전정훈 (나)</div>
          <div className="text-gray-4 text-[0.75rem]">1분 미만 전</div>
        </div>
        <div className="text-gray-4 cursor-pointer">
          <IoEllipsisVertical />
        </div>
      </div>
      <div className="pb-[1.25rem]">
        <div className="text-black text-[0.875rem] leading-[1.4rem]">
          업무에 수고가 많으십니다! 항상 고생이 많으시네요! 대단하십니다.
        </div>
      </div>
      <div className="border-b-[1px] text-gray-2">{''}</div>
    </div>
  );
};

export default CommentCard;
