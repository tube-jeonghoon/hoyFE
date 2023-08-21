import React, { useState } from 'react';
import { VscChevronDown } from 'react-icons/vsc';
import { AiOutlinePlus, AiFillStar } from 'react-icons/ai';
import Image from 'next/image';
import { useRecoilState, useRecoilStateLoadable } from 'recoil';
import {
  isCreateWorkspaceModalState,
  isSearchMemberModalState,
  isWorkspaceModalState,
} from '@/store/atom/modalStatus';
import WorkspaceSelectModal from '../modal/workspaceSelectModal';
import CreateWorkSpaceModal from '../modal/createWorkSpaceModal';
import SearchMemberModal from '../searchMemberModal';
import { useRouter } from 'next/router';

const SideBar = () => {
  const router = useRouter();
  const [workspaceVisible, setWorkspaceVisible] = useRecoilState(
    isWorkspaceModalState,
  );
  const [createWorkspaceVisible, setCreateWorkspaceVisible] = useRecoilState(
    isCreateWorkspaceModalState,
  );
  const [searchMemeberVisible, setSearchMemeberVisible] = useRecoilState(
    isSearchMemberModalState,
  );

  const [userList, setUserList] = useState([
    '전정훈',
    '정혜승',
    '권용재',
    '방민석',
    '하정민',
    '방민석',
  ]);

  const [groupList, setGroupList] = useState([
    '디자인팀 (4)',
    '개발팀 (6)',
    '기획팀 (3)',
    '스튜디오 (2)',
    '데브캠프 (7)',
    '운영팀 (7)',
  ]);

  const toggleWorkspace = () => {
    setWorkspaceVisible(!workspaceVisible);
  };

  const toggleSearchMember = () => {
    setSearchMemeberVisible(!searchMemeberVisible);
  };

  return (
    <div className="my-[2.5rem] mx-[1.5rem] flex flex-col gap-[2rem]">
      <div className="team-logo flex items-center relative">
        <div className="w-[2.5rem]">
          <Image src="/img/teamImage.png" alt="img" width="40" height="40" />
        </div>
        <button
          onClick={toggleWorkspace}
          className="ml-[0.3rem] flex items-center"
        >
          <div className="mx-[0.62rem] font-bold">TEAMSPARTA</div>
          <VscChevronDown />
        </button>
        {workspaceVisible && <WorkspaceSelectModal />}
      </div>
      <div className="sidebar-menu text-[0.875rem]">
        <div
          className="flex items-center p-[0.75rem] hover:bg-gray-1 hover:rounded-[0.5rem] cursor-pointer"
          onClick={() => router.push('/home')}
        >
          <div className="mr-[0.75rem]">
            <Image src="/img/user.png" alt="img" width="24" height="24" />
          </div>
          <div>전정훈 (나)</div>
        </div>
        <div className="flex items-center p-[0.75rem] hover:bg-gray-1 hover:rounded-[0.5rem] cursor-pointer">
          <div className="mr-[0.75rem]">
            <Image
              src="/img/notifications.png"
              alt="img"
              width="24"
              height="24"
            />
          </div>
          <div>업데이트</div>
        </div>
        <div className="flex items-center p-[0.75rem] hover:bg-gray-1 hover:rounded-[0.5rem] cursor-pointer">
          <div className="mr-[0.75rem]">
            <Image src="/img/search.png" alt="img" width="24" height="24" />
          </div>
          <div>멤버 찾기</div>
        </div>
        <div className="flex items-center p-[0.75rem] hover:bg-gray-1 hover:rounded-[0.5rem] cursor-pointer">
          <div className="mr-[0.75rem]">
            <Image src="/img/settings.png" alt="img" width="24" height="24" />
          </div>
          <div>설정</div>
        </div>
      </div>

      <div className="border-b-[1px] w-full">{''}</div>

      <div className="favorite-person-Area">
        <div className="flex items-center justify-between h-[2.5rem] px-[0.75rem] ">
          <div className="font-bold">자주 찾는 멤버</div>
          <div className="cursor-pointer" onClick={toggleSearchMember}>
            <AiOutlinePlus />
          </div>
        </div>
        <div className="favorite-persion text-[0.875rem] max-h-[12rem] overflow-y-auto">
          {userList.map((user, idx) => (
            <div
              key={idx}
              className="flex items-center p-[0.75rem] cursor-pointer hover:bg-gray-1 hover:rounded-[0.5rem]"
            >
              <div>
                <Image src="/img/user.png" alt="img" width="24" height="24" />
              </div>
              <div className="mx-[0.75rem]">{user}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-b-[1px] w-full">{''}</div>
      <div>
        <div className="flex items-center justify-between px-[0.75rem] mb-[0.6rem]">
          <div className="font-bold">그룹 보기</div>
          <div className="cursor-pointer">
            <AiOutlinePlus />
          </div>
        </div>
        <div className="max-h-[24rem] h-[15rem] overflow-y-auto">
          {groupList.map((group, idx) => (
            <div
              key={idx}
              className="text-[0.875rem] cursor-pointer hover:bg-gray-1 hover:rounded-[0.5rem]"
            >
              <div className="p-[0.75rem]">{group}</div>
            </div>
          ))}
        </div>
      </div>
      {createWorkspaceVisible && <CreateWorkSpaceModal />}
      {searchMemeberVisible && <SearchMemberModal />}
    </div>
  );
};

export default SideBar;
