import React, { useEffect, useRef, useState } from 'react';
import { VscChevronDown } from 'react-icons/vsc';
import { AiOutlinePlus, AiFillStar } from 'react-icons/ai';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import {
  isCreateGroupModalState,
  isCreateWorkspaceModalState,
  isSearchMemberModalState,
  isSelectWorkspaceModalState,
} from '@/store/atom/modalStatus';
import WorkspaceSelectModal from '../modal/workspaceSelectModal';
import CreateWorkSpaceModal from '../modal/createWorkSpaceModal';
import SearchMemberModal from '../searchMemberModal';
import { useRouter } from 'next/router';
import axios from 'axios';
import workspaceListState from '@/store/atom/workspaceListState';
import {
  currentGroupState,
  currentUserDataState,
  currentHeaderNameState,
  currentWorkspaceState,
} from '@/store/atom/userStatusState';
import Cookies from 'js-cookie';
import CreateGroupModal from '../modal/createGroupModal';

interface GroupList {
  id: number;
  name: string;
  memberCount: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

const SideBar = () => {
  const router = useRouter();
  const userName = '전정훈';
  const [currentUserData, setCurrentUserData] =
    useRecoilState(currentUserDataState);
  const [currentHeaderName, setCurrentHeaderName] = useRecoilState(
    currentHeaderNameState,
  );
  const [workspaceSelectVisible, setWorkspaceSelectVisible] = useRecoilState(
    isSelectWorkspaceModalState,
  );
  const [createWorkspaceVisible, setCreateWorkspaceVisible] = useRecoilState(
    isCreateWorkspaceModalState,
  );
  const [searchMemeberVisible, setSearchMemeberVisible] = useRecoilState(
    isSearchMemberModalState,
  );
  const [createGroupModalVisible, setCreateGroupModalVisible] = useRecoilState(
    isCreateGroupModalState,
  );
  const [workspaceList, setWorkspaceList] = useRecoilState(workspaceListState);
  const [currentWorkSpace, setCurrentWorkSpace] = useRecoilState(
    currentWorkspaceState,
  );
  const [currentGroup, setCurrentGroup] = useRecoilState(currentGroupState);

  const [userList, setUserList] = useState([
    '전정훈',
    '정혜승',
    '권용재',
    '방민석',
    '하정민',
    '방민석',
  ]);

  const [groupList, setGroupList] = useState([]);

  const toggleWorkspaceSelect = () => {
    setWorkspaceSelectVisible(!workspaceSelectVisible);
  };

  const toggleSearchMember = () => {
    setSearchMemeberVisible(!searchMemeberVisible);
  };

  const toggleCreateGroupModal = () => {
    setCreateGroupModalVisible(!createGroupModalVisible);
  };

  const fetchWorkSpaceData = async () => {
    try {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Authorization: `${process.env.NEXT_PUBLIC_TEMP_ACCESS_TOKEN}`,
          },
        },
      );
      setWorkspaceList(res.data);
      console.log('받아온 워크스페이스 리스트 ', res.data);
      setCurrentWorkSpace(res.data[0]);
      console.log('기본 선택된 워크스페이스', res.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGroupListData = async () => {
    try {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/1/group`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('fetchGroupListData', res.data);
      setGroupList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/current-user`,
        {
          headers: {
            // Authorization: `${process.env.NEXT_PUBLIC_TEMP_ACCESS_TOKEN}`,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log(res.data);
      setCurrentUserData(res.data);
      setCurrentHeaderName(res.data.nickname);
    } catch (error) {
      console.error(error);
    }
  };

  const userDataHandler = () => {
    fetchUserData();
    router.push('/home');
  };

  const fetchGroupState = (id: number, name: string): void => {
    setCurrentGroup(id);
    setCurrentHeaderName(name);
    router.push('/viewGroup');
  };

  useEffect(() => {
    // console.log(currentGroup);
  }, [currentGroup]);

  useEffect(() => {
    fetchWorkSpaceData();
    fetchUserData();
    fetchGroupListData();
  }, []);

  return (
    <div className="my-[2.5rem] mx-[1.5rem] flex flex-col gap-[2rem]">
      <div
        className="team-logo flex items-center justify-between relative
        cursor-pointer rounded-[0.5rem]"
        onClick={toggleWorkspaceSelect}
      >
        <div className="flex items-center gap-[0.62rem]">
          <div className="desktop:w-[1.5rem] desktopL:w-[2.5rem]">
            <Image src="/img/teamImage.png" alt="img" width="40" height="40" />
          </div>
          <div className="text-black mx-[0.62rem] desktop:text-[0.8rem] desktopL:text-[1rem] font-bold">
            {currentWorkSpace.workspace_name}
          </div>
        </div>
        <div
          // onClick={toggleWorkspaceSelect}
          className="ml-[0.3rem] flex items-center"
        >
          <VscChevronDown />
        </div>
        {workspaceSelectVisible && <WorkspaceSelectModal />}
      </div>
      <div className="sidebar-menu text-[0.875rem] text-black">
        <div
          className="flex items-center p-[0.75rem] hover:bg-gray-1 hover:rounded-[0.5rem] cursor-pointer"
          onClick={userDataHandler}
        >
          <div className="mr-[0.75rem]">
            {currentUserData.imgUrl && (
              <Image
                src={currentUserData.imgUrl}
                alt="img"
                width="24"
                height="24"
              />
            )}
          </div>
          <div className="flex gap-[0.2rem]">
            <div>{currentUserData.nickname}</div>
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
          <div className="font-bold text-black">자주 찾는 멤버</div>
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
          <div className="font-bold text-black">그룹 보기</div>
          <div className="cursor-pointer" onClick={toggleCreateGroupModal}>
            <AiOutlinePlus />
          </div>
          {createGroupModalVisible && <CreateGroupModal />}
        </div>
        <div className="max-h-[24rem] h-[15rem] overflow-y-auto">
          {groupList?.map((group: GroupList) => (
            <div
              key={group.id}
              className="cursor-pointer hover:bg-gray-1 hover:rounded-[0.5rem] text-black"
              onClick={() => fetchGroupState(group.id, group.name)}
            >
              <div className="p-[0.75rem] leading-[1.4rem] text-[0.875rem] flex items-center gap-[0.1rem] ">
                <div>{group.name}</div>
                <div className="tracking-[0.1rem]">({group.memberCount})</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {createWorkspaceVisible && <CreateWorkSpaceModal />}
    </div>
  );
};

export default SideBar;
