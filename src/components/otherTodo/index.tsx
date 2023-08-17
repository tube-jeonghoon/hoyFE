import React from 'react';
import Image from 'next/image';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import userProfile from '../../../public/img/userProfile.png';
import star from '../../../public/img/star.svg';
import checkBoxIcon from '../../../public/img/checkBox.svg';
import { IoEllipsisVertical } from 'react-icons/io5';

const OtherTodo = () => {
  return (
    <div className="card flex flex-col gap-[0.62rem] w-[19rem]">
      <div className="flex items-center justify-between">
        <div className="flex gap-[0.62rem] items-center">
          <div className="w-[1.5rem] h-[1.5rem]">
            <Image src={userProfile} alt="유저프로필" />
          </div>
          <div className="text-black text-[1.125rem] font-bold leading-[1.8rem]">
            하정민
          </div>
        </div>
        <div className="w-[1.5rem] text-black">
          <Image src={star} alt="즐겨찾기" />
        </div>
      </div>
      <div className="flex items-center px-[0.75rem] justify-between">
        <div className="text-gray-4">
          <MdKeyboardArrowLeft />
        </div>
        <div className="flex items-center gap-[0.25rem]">
          <div className="text-black text-[0.875rem] font-bold leading-[1.4rem]">
            목요일
          </div>
          <div className="text-gray-5 text-[0.75rem] leading-[1.4rem]">
            8/24
          </div>
        </div>
        <div className="text-gray-4">
          <MdKeyboardArrowRight />
        </div>
      </div>
      <div>
        <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
          <div className="text-black mr-[0.62rem] cursor-pointer w-[1.5rem]">
            <Image src={checkBoxIcon} alt="체크박스" />
          </div>
          <div className="w-full text-[0.875rem] text-black mr-[0.62rem] flex">
            5시 전까지 주간회의록 정리
            <div className="ml-[0.62rem] text-gray-4">[12]</div>
          </div>
          <div className="cursor-pointer">
            <IoEllipsisVertical />
          </div>
        </div>
        <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
          <div className="text-black mr-[0.62rem] cursor-pointer w-[1.5rem]">
            <Image src={checkBoxIcon} alt="체크박스" />
          </div>
          <div className="flex items-center mr-[0.62rem]">
            <div className="w-[0.375rem] h-[0.375rem] border rounded-[5rem] bg-[#ff4b4b]"></div>
          </div>
          <div className="w-full text-[0.875rem] text-black mr-[0.62rem] flex">
            코드 리뷰하기
            <div className="ml-[0.62rem] text-gray-4">[5]</div>
          </div>
          <div className="cursor-pointer">
            <IoEllipsisVertical />
          </div>
        </div>
        <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
          <div className="text-black mr-[0.62rem] cursor-pointer w-[1.5rem]">
            <Image src={checkBoxIcon} alt="체크박스" />
          </div>
          <div className="flex items-center mr-[0.62rem]">
            <div className="w-[0.375rem] h-[0.375rem] border rounded-[5rem] bg-[#ff4b4b]"></div>
          </div>
          <div className="w-full text-[0.875rem] text-black mr-[0.62rem] flex">
            코드 리뷰하기
            <div className="ml-[0.62rem] text-gray-4">[5]</div>
          </div>
          <div className="cursor-pointer">
            <IoEllipsisVertical />
          </div>
        </div>
        <div className="todo border-[0.1rem] p-[0.75rem] rounded-[0.5rem] flex items-center mb-[0.62rem]">
          <div className="text-black mr-[0.62rem] cursor-pointer w-[1.5rem]">
            <Image src={checkBoxIcon} alt="체크박스" />
          </div>
          <div className="flex items-center mr-[0.62rem]">
            <div className="w-[0.375rem] h-[0.375rem] border rounded-[5rem] bg-[#ff4b4b]"></div>
          </div>
          <div className="w-full text-[0.875rem] text-black mr-[0.62rem] flex">
            코드 리뷰하기
            <div className="ml-[0.62rem] text-gray-4">[5]</div>
          </div>
          <div className="cursor-pointer">
            <IoEllipsisVertical />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherTodo;
