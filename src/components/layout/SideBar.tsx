import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import workspaceListState from '@/store/atom/workspaceListState';
import { currentWorkspace } from '@/store/atom/userStatusState';
import Cookies from 'js-cookie';

const SideBar = () => {
  const router = useRouter();
  const userName = '전정훈';
  const [accessToken, setAccessToken] = useState('');
  const [workspaceVisible, setWorkspaceVisible] = useRecoilState(
    isWorkspaceModalState,
  );
  const [createWorkspaceVisible, setCreateWorkspaceVisible] = useRecoilState(
    isCreateWorkspaceModalState,
  );
  const [searchMemeberVisible, setSearchMemeberVisible] = useRecoilState(
    isSearchMemberModalState,
  );
  const [workspaceList, setWorkspaceList] = useRecoilState(workspaceListState);
  const [currentWorkSpace, setCurrentWorkSpace] =
    useRecoilState(currentWorkspace);

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

  const fechWorkSpaceData = async () => {
    try {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace`,
        { 
          headers: {
            // Authorization: `${accessToken}`,
            Authorization: `${process.env.NEXT_PUBLIC_TEMP_ACCESS_TOKEN}`,
          },
        },
      );

      setWorkspaceList(res.data);
      console.log(res.data);
      setCurrentWorkSpace(res.data[0]);
      console.log(res.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/1/current-user`,
        {
          headers: {
            Authorization: `${process.env.NEXT_PUBLIC_TEMP_ACCESS_TOKEN}`,
            // Authorization: `${accessToken}`,
          },
        },
      );

      console.log(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    fechWorkSpaceData();
    fetchUserData();
    console.log(`Sidebar 컴포넌트`);
  }, []);

  return (
    <div className="my-[2.5rem] mx-[1.5rem] flex flex-col gap-[2rem]">
      <div className="team-logo flex items-center relative">
        <div className="desktop:w-[1.5rem] desktopL:w-[2.5rem]">
          <Image src="/img/teamImage.png" alt="img" width="40" height="40" />
        </div>
        <button
          onClick={toggleWorkspace}
          className="ml-[0.3rem] flex items-center"
        >
          <div className="mx-[0.62rem] desktop:text-[0.8rem] desktopL:text-[1rem] font-bold">
            {currentWorkSpace.workspace_name}
          </div>
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
          <div className="flex gap-[0.2rem]">
            <div>{userName}</div>
            <div>(나)</div>
          </div>
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
        <div
          className="flex items-center p-[0.75rem] hover:bg-gray-1 hover:rounded-[0.5rem] cursor-pointer"
          onClick={toggleSearchMember}
        >
          <div className="mr-[0.75rem]">
            <Image src="/img/search.png" alt="img" width="24" height="24" />
          </div>
          <div>멤버 찾기</div>
        </div>
        {searchMemeberVisible && <SearchMemberModal />}
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
          <div className="cursor-pointer">
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
    </div>
  );
};

export default SideBar;
