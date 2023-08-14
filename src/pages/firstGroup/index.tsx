import React from 'react';
import Image from 'next/image';
import defaultUser from '../../../public/img/defaultUser.png';

const FirstGroup = () => {
  return (
    <div className="w-screen h-screen">
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-[6.25rem] w-[">
          <div className="mx-auto">
            <div className="text-[1.5rem] font-bold leading-[2.4rem]">
              워크스페이스 설정을 완료하세요.
            </div>
          </div>
          <div className="flex flex-col gap-[3.75rem] p-[1.5rem] border-[1px] rounded-[0.75rem]">
            <div className="flex flex-col gap-[1rem] w-full">
              <div className="text-black text-[1.25rem] font-bold">이름</div>
              <div>
                <input
                  className="border-[1px] rounded-[0.3rem] px-[0.75rem] py-[0.25rem] w-full
                    text-gray-4 h-[3rem] focus:text-black focus:outline-none bg-transparent"
                  placeholder="워크스페이스 이름을 입력하세요."
                  type="text"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[1rem]">
              <div className="text-black text-[1.25rem] font-bold">사진</div>
              <div className="flex gap-[1.5rem] items-center">
                <div className="w-[5rem] h-[5rem]">
                  <Image src={defaultUser} alt="defaultUser" />
                </div>
                <div className="flex flex-col gap-[0.62rem]">
                  <div className="flex gap-[0.81rem]">
                    <div
                      className="text-black border-[1px] px-[0.75rem] py-[0.25rem] font-bold
                      rounded-[0.5rem] w-[7.5rem] h-[3rem] flex items-center justify-center
                      cursor-pointer"
                    >
                      사진 추가
                    </div>
                    <div
                      className="text-black border-[1px] px-[0.75rem] py-[0.25rem] font-bold
                      rounded-[0.5rem] w-[7.5rem] h-[3rem] flex items-center justify-center
                      cursor-pointer"
                    >
                      사진 삭제
                    </div>
                  </div>
                  <div className="text-gray-4 text-[0.75rem] leading-[1.2rem]">
                    워크스페이스의 대표사진으로 전체공개입니다.
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto">
              <div
                className="font-bold leading-[1.6rem] px-[0.75rem] py-[0.25rem] 
                  border-[1px] h-[3rem] w-[7.5rem] rounded-[0.5rem] flex items-center
                  justify-center bg-gray-3 text-white cursor-pointer hover:bg-primary-blue"
              >
                시작하기
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstGroup;
