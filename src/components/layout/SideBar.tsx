import React from 'react';
import { VscChevronDown } from 'react-icons/vsc';
import { AiOutlinePlus, AiFillStar } from 'react-icons/ai';
import Image from 'next/image';

const SideBar = () => {
  return (
    <div className="my-[2.5rem] mx-[1.5rem]">
      <div className="team-logo flex items-center ">
        <div className="w-[2.5rem]">
          <Image src="/img/teamImage.png" alt="img" width="40" height="40" />
        </div>
        <div className="ml-[0.62rem] font-bold">TEAMSPARTA</div>
        <button className="ml-[0.3rem]">
          <VscChevronDown />
        </button>
      </div>
      <div className="sidebar-menu mt-[2rem] text-[0.875rem]">
        <button className="flex items-center p-[0.75rem]">
          <div className="mr-[0.75rem]">
            <Image src="/img/user.png" alt="img" width="24" height="24" />
          </div>
          <div>전정훈 (나)</div>
        </button>
        <button className="flex items-center p-[0.75rem]">
          <div className="mr-[0.75rem]">
            <Image
              src="/img/notifications.png"
              alt="img"
              width="24"
              height="24"
            />
          </div>
          <div>업데이트</div>
        </button>
        <button className="flex items-center p-[0.75rem]">
          <div className="mr-[0.75rem]">
            <Image src="/img/search.png" alt="img" width="24" height="24" />
          </div>
          <div>멤버 찾기</div>
        </button>
        <button className="flex items-center p-[0.75rem]">
          <div className="mr-[0.75rem]">
            <Image src="/img/settings.png" alt="img" width="24" height="24" />
          </div>
          <div>설정</div>
        </button>
      </div>

      <div className="border-[0.1rem] my-[2rem] w-full">{''}</div>

      <div className="favorite-person-Area px-[0.75rem]">
        <div className="flex items-center justify-between h-[2.5rem]">
          <div className="font-bold">자주 찾는 멤버</div>
          <div>
            <AiOutlinePlus />
          </div>
        </div>
        <div className="favorite-persion text-[0.875rem]">
          <div className="flex items-center justify-between py-[0.75rem]">
            <div className="flex items-center">
              <div>
                <Image src="/img/user.png" alt="img" width="24" height="24" />
              </div>
              <div className="mx-[0.75rem]">최영준</div>
            </div>
            <div>
              <AiFillStar />
            </div>
          </div>
          <div className="flex items-center justify-between py-[0.75rem]">
            <div className="flex items-center">
              <div>
                <Image
                  src="/img/person/hajeongmin.png"
                  alt="img"
                  width="24"
                  height="24"
                />
              </div>
              <div className="mx-[0.75rem]">하정민</div>
            </div>
            <div>
              <AiFillStar />
            </div>
          </div>
          <div className="flex items-center justify-between py-[0.75rem]">
            <div className="flex items-center">
              <div>
                <Image
                  src="/img/person/honggildong.png"
                  alt="img"
                  width="24"
                  height="24"
                />
              </div>
              <div className="mx-[0.75rem]">허지수</div>
            </div>
            <div>
              <AiFillStar />
            </div>
          </div>
        </div>
      </div>
      <div className="border-[0.1rem] my-[2rem] w-full">{''}</div>
      <div>
        <div className="flex items-center justify-between px-[0.75rem] mb-[0.6rem]">
          <div className="font-bold">그룹 보기</div>
          <div>
            <AiOutlinePlus />
          </div>
        </div>
        <div className="text-[0.875rem] cursor-pointer">
          <div className="p-[0.75rem]">디자인팀 (6)</div>
        </div>
        <div className="text-[0.875rem] cursor-pointer">
          <div className="p-[0.75rem]">개발팀 (4)</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
